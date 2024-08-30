const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Song = require('../models/song.model');
const Karaoke =require ('../models/karaoke')
const { status } = require('../util/constant');


const karaokeSongs = async (req, res) => {
    try {
        const songs = await Song.find().populate('artistId');
        console.log("🚀 ~ karaokeSongs ~ songs:", songs)
        const obj = songs.map(song => ({
            songId: song._id,
            title: song.title,
            artistNames: song.artistId.map(artist => artist.ArtistName).join(','),
            coverArtImage: song.coverArtImage.imageUrl,
            karaokeFile: song.karaokeFile.karaokeUrl,
            lyrics: song.lyrics,
            duration: song.duration,
        }));

        return res.status(200).json({
            error_code: 200,
            message: 'Songs retrieved successfully',
            data: obj
        });
    } catch (err) {
        console.error('Error fetching songs:', err);
        return res.status(500).json({ error_code: 500, message: 'Internal server error' });
    }

}

const addKaraokeSong = async (req, res) => {
    try {
        const userId = req.userId;
        const { songId } = req.body;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imagePath = `uploads/${req.file.filename}`;
        const imageUrl = `${baseUrl}/${imagePath}`;
        await Karaoke.create({
            userId,
            songId,
            karaokeFile: {
                fileName: req.file.filename,
                fileAddress: req.file.filename,
                karaokeUrl: imageUrl
            }
        });
        return res.status(200).json({
            error_code: 200,
            message: 'Karaoke song file saved successfully'
        });
    } catch (err) {
        console.error('Error saving karaoke song file:', err);
        return res.status(500).json({ error_code: 500, message: 'Internal server error' });
    }
};
    
module.exports = {
    karaokeSongs,
    addKaraokeSong
};