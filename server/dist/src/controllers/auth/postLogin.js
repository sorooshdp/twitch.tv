// Login handler
export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    // Handle login logic here
    return res.send("Login successful");
};
