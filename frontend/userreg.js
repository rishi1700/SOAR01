import axios from 'axios';

const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:5000/auth/register', {
      username: 'rishi03',
      password: 'rishi03',
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

registerUser();

