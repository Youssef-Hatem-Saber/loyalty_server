const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const generateTokens = (userId, email) => {
    const accessToken = jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // Access Token قصير العمر
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" } // Refresh Token طويل العمر
    );

    return { accessToken, refreshToken };
};



const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email already used" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        res.json({
            message: "Account created",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        const correct = await bcrypt.compare(password, user.password);
        if (!correct) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const { accessToken, refreshToken } = generateTokens(user._id, user.email);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh Token required" });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Expired refresh token" });
                }

                const accessToken = jwt.sign(
                    { id: decoded.id },
                    process.env.JWT_SECRET,
                    { expiresIn: "15m" }
                );

                res.json({
                    message: "New Access Token created",
                    accessToken
                });
            }
        );

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken)
            return res.status(400).json({ message: "Refresh Token required" });

        const user = await User.findOne({ refreshToken });

        if (!user)
            return res.status(400).json({ message: "Invalid refresh token" });

        user.refreshToken = null;
        await user.save();

        res.json({ message: "Logged out successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout
};
