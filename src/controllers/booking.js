const Booking = require('../models/booking');
const Car = require('../models/car');
const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")(
  "sk_test_51MuHiXI1g8HQx3Exvd17YWQHiLfWCLacgj8A6aGAAn2hRZKICgQuhw6W8TDGSWpn3yA7HEsDuqPCnQcX6CM9HT8c00BYYk0pBk"
);

exports.index = async (req, res) =>{
    try {
        const bookings = await Booking.find().populate('car')
        res.send(bookings)        
    } catch (error) {
        return res.status(400).json(error);
    }
}



exports.store = async (req, res) => {

    const { token } = req.body;
    try {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });
  
      const payment = await stripe.charges.create(
        {
          amount: req.body.totalAmount * 100,
          currency: "BDT",
          customer: customer.id,
          receipt_email: token.email
        },
        {
          idempotencyKey: uuidv4(),          
        }
      );
  
      if (payment) {
        req.body.transactionId = payment.source.id;
        const newbooking = new Booking(req.body);
        await newbooking.save();
        
        const car = await Car.findOne({ _id: req.body.car });

        console.log(req.body.car);
        car.bookedTimeSlots.push(req.body.bookedTimeSlots);
  
        await car.save();
        res.send("Your booking is successfull");
      } else {
        return res.status(400).json(error);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }

}


