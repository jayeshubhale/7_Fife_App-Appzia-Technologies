const Artist = require('../models/artist.model');


const createArtist = async (req, res) => {
    try {
        console.log(req,"=============================>123");
        console.log(req.body,"hooooo")
        const { ArtistName } = req.body;

        // Check if the required fields are present in the request body
        if (!ArtistName) {
            return res.status(400).send({
                error_code: 400,
                message: "Artist name is required"
            });
        }

        let obj = {
            ArtistName: ArtistName,
        };

        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const imagePath = `uploads/${req.file.filename}`;
            const imageUrl = `${baseUrl}/${imagePath}`;

            obj["image"] = {
                fileName: req.file.filename,
                fileAddress: req.file.path
            };
            obj["imageUrl"] = imageUrl;
        }
        // Save 'obj' to the database
        const newArtist = await Artist.create(obj);
        console.log("🚀 ~ createArtist ~ newArtist:", newArtist);

        // Return a success response with the newly created Artist 
        return res.status(200).send({
            error_code: 200,
            message: "Artist created",
            Artist: newArtist
        });
    } catch (err) {
        console.error("Error inside createArtist Controller", err);
        return res.status(500).send({
            error_code: 500,
            message: "Internal Server Error"
        });
    }
};


const updateArtist = async (req, res) => {
    try {
        const artistId = req.params.id;
        const { ArtistName } = req.body;

        if (!ArtistName) {
            return res.status(400).send({
                error_code: 400,
                message: "Artist name is required"
            });
        }

        const updates = { ArtistName };

        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const imagePath = `uploads/${req.file.filename}`;
            const imageUrl = `${baseUrl}/${imagePath}`;
            console.log("🚀 ~ updateArtist ~ imageUrl:", imageUrl);

            updates.image = {
                fileName: req.file.filename,
                fileAddress: req.file.path
            };
            updates.imageUrl = imageUrl;
        }
        const updatedArtist = await Artist.findByIdAndUpdate(artistId, updates, { new: true });

        if (!updatedArtist) {
            return res.status(404).send({
                error_code: 404,
                message: "Artist not found"
            });
        }
        return res.status(200).send({
            error_code: 200,
            message: "Artist updated successfully",
            Artist: updatedArtist
        });
    } catch (err) {
        console.error("Error inside updateArtist Controller", err);
        return res.status(500).send({
            error_code: 500,
            message: "Internal Server Error"
        });
    }
};


// Delete Artist
const deleteArtist = async (req, res) => {
    try {
        const artistId = req.params.id;

        // Delete artist by ID
        const deletedArtist = await Artist.findByIdAndDelete(artistId);

        // Check if the artist exists
        if (!deletedArtist) {
            return res.status(404).send({
                error_code: 404,
                message: "Artist not found"
            });
        }

        return res.status(200).send({
            error_code: 200,
            message: "Artist deleted successfully"
        });
    } catch (err) {
        console.log("Error inside deleteArtist Controller", err);
        return res.status(500).send({
            error_code: 500,
            message: "Internal Server Error"
        });
    }
};

// Get Artist by ID
const getArtistById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find artist by ID
        const artist = await Artist.findById(id);
        console.log("🚀 ~ getArtistById ~ artist:", artist)

        // Check if the artist exists
        if (!artist) {
            return res.status(404).send({
                error_code: 404,
                message: "Artist not found"
            });
        }

        return res.status(200).send({
            error_code: 200,
            message: "Artist found",
            Artist: artist
        });
    } catch (err) {
        console.log("Error inside getArtistById Controller", err);
        return res.status(500).send({
            error_code: 500,
            message: "Internal Server Error"
        });
    }
};

// Change Artist Status
const changeArtistStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const artistData = await Artist.findById(id);
        if (!artistData) {
            return res.status(400).send({
                error_code: 400,
                message: 'Ads not found'
            });
        }

        artistData.status = artistData.status === 'activate' ? 'deactivate' : 'activate';

        await artistData.save();
        res.status(200).send({
            message: `ads status toggled successfully to ${artistData.status}`,
            artistData: artistData
        });
    } catch (err) {
        console.error('Error inside update ', err);
        res.status(500).send({
            error_code: 500,
            message: 'Internal Server Error'

        });
    }
};

const allArtist =async(req,res)=>{
    try {

        const artists = await Artist.find();
        return res.status(200).json({
            error_code: 200,
            message: 'Artists fetched successfully',
            artists
        });

        
    } catch (error) {
        console.error('Error inside getAllArtist controller:', error);
        return res.status(500).json({
            error_code: 500,
            message: 'Internal Server Error'
        });
        
    }
}

const getAllArtist = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || '';

        // Build the query for fetching artists with pagination and search
        const artistQuery = Artist.find({
            ArtistName: { $regex: searchQuery, $options: 'i' }
        });

        // Execute the query with pagination
        const artists = await artistQuery.skip(skip).limit(limit);

        // Count total number of artists for pagination
        const totalCount = await Artist.countDocuments({
            ArtistName: { $regex: searchQuery, $options: 'i' }
        });

        res.json({
            error_code: 200,
            message: 'Artists retrieved successfully',
            artists,
            total_count: totalCount,
            page,
            limit
        });
    } catch (error) {
        console.error('Error inside getAllArtist controller:', error);
        return res.status(500).json({
            error_code: 500,
            message: 'Internal Server Error'
        });
    }
};




module.exports = {
    createArtist,
    updateArtist,
    deleteArtist,
    getArtistById,
    changeArtistStatus, getAllArtist,
    allArtist
};
