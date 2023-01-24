import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).send(err);

        //extract the password
        const { password, ...info } = data[0];
        return res.send(info);
    })

}

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send("Not authenticated!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).send("Token is not valid!");

        const q = "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

        db.query(
            q,
            [
                req.body.name,
                req.body.city,
                req.body.website,
                req.body.profilePic,
                req.body.coverPic,
                userInfo.id
            ],
            (err, data) => {
              if (err) res.status(500).json(err);
              if (data.affectedRows > 0) return res.json("Updated!");
              return res.status(403).json("You can update only your post!");
            }
          );
    }) 
}