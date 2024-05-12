import { Box, Divider, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import CourseCard from '~/components/CourseCard';
import useAxiosAPI from '~/hook/useAxiosAPI';
import useUserContext from '~/hook/useUserContext';

function Courses() {
  const [user] = useUserContext();
  const { axiosAPI, endpoints } = useAxiosAPI();

  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    await axiosAPI
      .get(endpoints.learning + '/courses/get-course-by-class/' + user.classCurr._id)
      .then((res) => {
        const data = res.data.data;
        setCourses(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <Box
      sx={{
        padding: '12px 12px 12px 20px',
      }}
    >
      <Divider>
        <Typography variant="h5">Course Available</Typography>
      </Divider>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </Box>
    </Box>
  );
}

export default Courses;