export const getTest = (req, res) => {
    if (err) res.status(404).send(err);
    res.status(200).send("Tets succeed!")
}