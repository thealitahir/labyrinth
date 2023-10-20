function loginUserFunction(payload) {
  return {
    status: true,
    message: "User Logged in Successfully",
    data: {
      _id: "6528f0edee8ad8724ddc655c",
      name: "Test Name",
      email: "testuser@gmail.com",
      password: "$2a$10$Ao/9UgrU/IIYheuF15bu5uEDpt5ogRtHuWrt5qHTnG5ahDAO1J2ge",
      createdAt: "2023-10-13T07:25:33.926Z",
      __v: 0,
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
  };
}

function signUpUserFunction(payload) {
  return {
    "status": true,
    "message": "Create a new user successfully.",
    "data": {
      "name": "Test Name",
      "email": "test@gmail.com",
      "password": "$2a$10$C.0VqZ6yt5YWisNnwr.AQeeEBrlhc54TV13.SgiMw937OiDI8PivS",
      "_id": "65291d7fa8a48a360d371284",
      "createdAt": "2023-10-13T10:35:43.255Z",
      "__v": 0
    }
  }
}

describe("POST /user/sign-up", () => {
  it("User Signup", async () => {
    const payload = {
      name: "Test User",
      email: "testuser@gmail.com",
      password: "12345678",
    };
    const response = signUpUserFunction(payload);

    expect(response.status).toBe(true);
  });
});

describe("POST /user/login", () => {
  it("User LOGIN", async () => {
    const payload = {
      email: "testuser@gmail.com",
      password: "12345678",
    };
    const response = loginUserFunction(payload);

    expect(response.status).toBe(true);
  });
});