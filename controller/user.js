const fs = require('fs')
const path = require('path')
const { user } = require("../models");


const index = async (req, res) => {
    user.findAll()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json({ error: error });
        });
}

const show = async (req, res) => {
    let id = req.params.id
    user.findOne({ where: { id: id } })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json({ error: error });
        });

}

const create = async (req, res) => {
    req.body.gambar = req.files.gambar[0].path;

    let data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        level: req.body.level,
        img: req.body.gambar
    }
    await user.create(data)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).json({
                message: 'internal server error',
                dataError: err
            })
        })
}

const update = async (req, res) => {

    let id = req.params.id
    const dataImage = await user.findOne({ where: { id } })
    let gambar = dataImage.dataValues.img; 
    req.body.img = req.files.gambar[0].path;
    await user.update(req.body, { where: { id: id } })
         .then(data => { 
            if(gambar != null){
                removeImage(gambar)
            }
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: 'internal server error',
                dataError: err
            })
        }) 
}

const destroy = async (req, res) => {

    let id = req.params.id
    const dataImage = await user.findOne({ where: { id } })
    let gambar = dataImage.dataValues.img;  

    await user.destroy({ where: { id: id } })
        .then(data => { 
            if(gambar != null){
                removeImage(gambar)
            }
            res.status(200).json({ msg: "success" });
        })
        .catch(err => {
            res.status(500).json({
                message: 'internal server error',
                dataError: err
            })
        })

}

const removeImage = (filePath) => {
    filePath = path.join(__dirname, '../', filePath);
    fs.unlink(filePath, err => console.log(err));
}

module.exports = {
    index,
    show,
    create,
    update,
    destroy
}