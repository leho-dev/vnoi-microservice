import styles from "./Dashboard.module.css";
import {
    Box,
    FormControl,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Fab,
    Button,
    Modal,
    Paper,
    Typography,
    Pagination,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { handleDatetime } from "~/utils/datetime";
import DropdownClass from "~/components/DropdownClass";
import SearchDebounce from "~/components/SearchDebounce";
import useConfirmDialog from "~/hook/useConfirmDialog";
import useAxiosAPI from "~/hook/useAxiosAPI";
import useLoadingContext from "~/hook/useLoadingContext";

export default function Dashboard() {
    const nav = useNavigate();
    const { axiosAPI, endpoints } = useAxiosAPI();
    const [loading, setLoading] = useLoadingContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const [confirm, ConfirmDialog] = useConfirmDialog();

    const [data, setData] = useState([]);
    const [result, setResult] = useState(null);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [filter, setFiliter] = useState({
        limit:
            parseInt(searchParams.get("limit")) ||
            import.meta.env.VITE_PAGE_SIZE,
        page: parseInt(searchParams.get("page")) || 1,
        classCurr: searchParams.get("class") || "all",
        status: searchParams.get("status") || "all",
    });

    const getData = async () => {
        if (loading) return;
        setLoading(true);
        const params = new URLSearchParams();
        params.append("limit", filter.limit);
        params.append("page", filter.page);
        if (search.trim()) params.append("search", search);
        if (filter.classCurr.trim()) params.append("class", filter.classCurr);
        if (filter.status) params.append("status", filter.status);

        await axiosAPI
            .get(endpoints.problems + "/get-by-lecturer?" + params.toString())
            .then((res) => {
                setData(res.data.data);
                setFiliter((prev) => {
                    const currentPage =
                        res.data.currentPage > res.data.totalPage
                            ? 1
                            : res.data.currentPage;

                    return {
                        ...prev,
                        page: currentPage,
                        totalPage: res.data.totalPage,
                    };
                });
            })
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setLoading(false));
    };

    const handleFilter = (value, type) => {
        setFiliter((prev) => {
            return {
                ...prev,
                [type]: value,
            };
        });

        setSearchParams((prev) => {
            prev.set(type, value);
            return prev;
        });
    };

    const handleDelete = async (slug) => {
        const isConfirmed = await confirm(
            "Delete",
            "This action can't Ctrl Z? Problem will be soft delete. After 30 days, problem will be delete forever! Are you sure?"
        );
        if (isConfirmed) {
            await axiosAPI
                .patch(endpoints.problems + `/${slug}`)
                .then((res) => {
                    if (res.status === 200) {
                        setData((prev) => {
                            prev = prev.filter((p) => p.slug !== slug);
                            return prev;
                        });
                        toast.success("Delete Success!");
                    }
                });
        }
    };

    const handleResult = async (_id, title, clss) => {
        await axiosAPI
            .get(endpoints.problems + `/get-result/${_id}`)
            .then((res) => {
                setResult({
                    title,
                    clss,
                    data: res.data.data,
                });
            });
    };

    const handleNewProblem = () => {
        nav("/lecturer/problems/__new");
    };

    useEffect(() => {
        getData();
    }, [filter.classCurr, filter.status, filter.page, filter.limit]);

    return (
        <>
            <Box
                sx={{
                    padding: "12px 12px 12px 20px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Pagination
                            count={filter.totalPage}
                            page={filter.page}
                            onChange={(_, value) => handleFilter(value, "page")}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "4px",
                        }}
                    >
                        <Fab
                            onClick={handleNewProblem}
                            color="primary"
                            size="small"
                        >
                            +
                        </Fab>
                        <SearchDebounce
                            search={search}
                            setSearch={setSearch}
                            fn={getData}
                        />
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <DropdownClass
                                classCurr={filter.classCurr}
                                handleFilter={handleFilter}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                displayEmpty
                                value={filter.status}
                                onChange={(e) =>
                                    handleFilter(e.target.value, "status")
                                }
                            >
                                <MenuItem value="all">ALL</MenuItem>
                                <MenuItem value={1}>UPCOMING</MenuItem>
                                <MenuItem value={2}>NOW</MenuItem>
                                <MenuItem value={3}>FINISHED</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <TableContainer>
                    <Table
                        className={styles.table}
                        sx={{ minWidth: 650 }}
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell align="center">Class</TableCell>
                                <TableCell align="center">Start</TableCell>
                                <TableCell align="center">Time</TableCell>
                                <TableCell align="center">Done</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        colSpan={6}
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        <CircularProgress size={20} />
                                    </TableCell>
                                </TableRow>
                            ) : data.length > 0 ? (
                                data.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.class?.name || "---"}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.timeStart
                                                ? handleDatetime(row.timeStart)
                                                : "Available"}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.testTime
                                                ? `${row.testTime} min`
                                                : "---"}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.done}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                onClick={() =>
                                                    nav(
                                                        "/lecturer/problems/" +
                                                            row.slug
                                                    )
                                                }
                                                size="small"
                                                variant="contained"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleResult(
                                                        row._id,
                                                        row.title,
                                                        row.class?.name
                                                    )
                                                }
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    marginLeft: "6px",
                                                }}
                                            >
                                                Result
                                            </Button>
                                            <Button
                                                sx={{
                                                    marginLeft: "6px",
                                                }}
                                                onClick={() =>
                                                    handleDelete(row.slug)
                                                }
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        ---
                                    </TableCell>
                                    <TableCell align="center">---</TableCell>
                                    <TableCell align="center">---</TableCell>
                                    <TableCell align="center">---</TableCell>
                                    <TableCell align="center">---</TableCell>
                                    <TableCell align="center">---</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {ConfirmDialog}
            </Box>
            <Modal
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                open={result !== null}
                onClose={() => setResult(null)}
            >
                <div>
                    <Typography
                        bgcolor="#fff"
                        component="h4"
                        sx={{
                            textAlign: "center",
                            py: 2,
                            fontWeight: "bold",
                            borderTopLeftRadius: "4px",
                            borderTopRightRadius: "4px",
                            bgcolor: "#ccc",
                        }}
                    >
                        {result?.title} - {result?.clss}
                    </Typography>
                    <TableContainer
                        sx={{
                            maxHeight: "80vh",
                            maxWidth: "60vw",
                            overflowY: "auto",
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                        }}
                        component={Paper}
                    >
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead>
                                <TableRow
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    <TableCell>No.</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">
                                        Full Name
                                    </TableCell>
                                    <TableCell align="center">Score</TableCell>
                                    <TableCell align="center">Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {result && result.data?.length > 0 ? (
                                    result.data.map((row, idx) => (
                                        <TableRow
                                            key={row._id}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    {
                                                        border: 0,
                                                    },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.author.email}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.author.fullName}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.score}
                                            </TableCell>
                                            <TableCell align="center">
                                                {handleDatetime(
                                                    row.requestReceivedAt,
                                                    true
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell align="center" colSpan={5}>
                                            No submit yet!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Modal>
        </>
    );
}