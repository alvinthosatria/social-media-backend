import { db } from "../connect.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



export const register = (req, res) => {
    //CHECK USER IF EXISTS
    const q = "SELECT * FROM users WHERE username = ?" //question mark provides more security

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).send(err) //json() or send() is the same
        if (data.length) return res.status(409).send("User already exists!")

        //CREATE A NEW USER
        //Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (`profilePic`, `username`, `email`, `password`, `name`) VALUE (?)"
        const values = [
            req.body.profilePic,
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send("User has been created!");
        });
    });
    
}

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).send(err)
        if (data.length === 0) return res.status(404).send("User not found!")

        //Since we select all from users, data is an array of only one user
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)

        if (!checkPassword) return res.status(400).send("Wrong password or username!")

        const token = jwt.sign({id : data[0].id}, "secretkey");
 
        const {password, ...others} = data[0]

        //this means we're gonna send and take the cookie through the websites
        res.cookie("accessToken", token, {
            httpOnly: true
        }).status(200).send(others)

        //the accessToken includes our userID
        //we can reach the userID by decrypting the token and 
        //we will be able to delete posts, like posts, follow users, timeline posts, etc,
        //so we don't have to always send through the body
    })
}

export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none" //api and client port number are different. hence sameSite is none
    }).status(200).send("User has been logged out")
}