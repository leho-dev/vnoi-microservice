import { ExpandMoreOutlined } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./Testcase.module.css";

function Testcase({ data, idx, resultCheck }) {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreOutlined />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    Testcase {idx + 1}{" "}
                    {resultCheck && (
                        <Chip
                            component={"span"}
                            label={resultCheck.pass ? "PASS" : "FAIL"}
                            size="small"
                            variant="outlined"
                            color={resultCheck.pass ? "success" : "error"}
                        />
                    )}
                </Typography>
            </AccordionSummary>
            <AccordionDetails className={styles.testcase}>
                <Box className={styles.testcaseBox}>
                    <span
                        style={{
                            marginLeft: "4px",
                            fontWeight: "500",
                        }}
                    >
                        Input
                    </span>
                    <ul className={styles.testcaseList}>
                        {data.input.map((inp, idx) => {
                            return (
                                <li className={styles.testcaseItem} key={idx}>
                                    {inp}
                                </li>
                            );
                        })}
                    </ul>
                </Box>
                <Box className={styles.testcaseBox}>
                    <span
                        style={{
                            marginLeft: "4px",
                            fontWeight: "500",
                        }}
                    >
                        Expect
                    </span>
                    <ul className={styles.testcaseList}>
                        {data.output ? (
                            data.output.map((out, idx) => {
                                return (
                                    <li
                                        className={styles.testcaseItem}
                                        key={idx}
                                    >
                                        {out}
                                    </li>
                                );
                            })
                        ) : (
                            <li className={styles.testcaseItem}></li>
                        )}
                    </ul>
                </Box>
                {resultCheck && (
                    <Box className={styles.testcaseBox}>
                        <span
                            style={{
                                marginLeft: "4px",
                                fontWeight: "500",
                            }}
                        >
                            Output
                        </span>
                        <ul className={styles.testcaseList}>
                            {resultCheck.result ? (
                                resultCheck.result.map((res, idx) => {
                                    return (
                                        <li
                                            className={styles.testcaseItem}
                                            key={idx}
                                        >
                                            {res}
                                        </li>
                                    );
                                })
                            ) : (
                                <li className={styles.testcaseItem}></li>
                            )}
                        </ul>
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
}

export default Testcase;