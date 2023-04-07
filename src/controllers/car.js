const Car = require('../models/car');

exports.index = async (req, res) =>{
    try {
        const cars = await Car.find();
        res.send(cars);
    } catch (error) {
        return res.status(400).json(error);
    }
}

exports.store = async (req, res) => {
    try {
        const newcar = new Car(req.body);
        await newcar.save();
        res.send("Car added successfully");
    } catch (error) {
        return res.status(400).json(error);
    }
}



exports.update = async (req, res)=> {
    try {

        const car = await Car.findById(req.params.id);

        car.name        = req.body.name;
        car.image       = req.body.image;
        car.fuelType    = req.body.fuelType;
        car.rentPerHour = req.body.rentPerHour;
        car.capacity    = req.body.capacity;  

        await car.save();
    
        res.send("Car details updated successfully");
      } catch (error) {
        return res.status(400).json(error);
      }
}


exports.destroy = async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
    
        res.send("Car deleted successfully");
      } catch (error) {
        return res.status(400).json(error);
      }
}