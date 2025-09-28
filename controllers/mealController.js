export const analyseMeal = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("file not exist");
        }

        console.log(req.file);
        return res.status(200).send(`file has uploaded by success ${req.file.path}`);
    }catch (e) {
        console.error("errorin uploading the file check it ", e);
        res.status(500).send('check the console!!!');
    }
}