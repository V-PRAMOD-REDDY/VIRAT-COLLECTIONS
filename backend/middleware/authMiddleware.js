import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 👈 ఒకవేళ req.body లేకపోతే దాన్ని డిఫైన్ చేయాలి
        if (!req.body) {
            req.body = {};
        }

        req.body.userId = token_decode.id; // ఇప్పుడు 'undefined' ఎర్రర్ రాదు
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;