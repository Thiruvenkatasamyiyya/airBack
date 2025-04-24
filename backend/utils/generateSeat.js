const generateSeats = () => {
    const seats = [];
    const rows = 6;
    const cols = ['A', 'B', 'C', 'D'];
    for (let i = 1; i <= rows; i++) {
      for (let j = 0; j < cols.length; j++) {
        seats.push({ seat_number: `${i}${cols[j]}`, status: 'available' ,userId : null});
      }
    }
    return seats;
  };

  export default generateSeats