import React from "react";
import { cars } from "@/constants";
function Car({ params }: { params: { car: string } }) {
  const selectedCar = cars[Number(params.car)];
  return (
    <div>
      <h1 className="text-4xl font-bold">{selectedCar.name}</h1>
      <h2>{selectedCar.year}</h2>
      <h3>{selectedCar.awards.toString()}</h3>
      <p>{selectedCar.carDesc}</p>
      <img src={selectedCar.photos[0]} alt={selectedCar.name + " photo"} />
    </div>
  );
}

export default Car;
