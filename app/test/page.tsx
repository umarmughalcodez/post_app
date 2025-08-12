"use client";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { decrement, increment, reset } from "@/store/counterSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Test = () => {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.count.count);

  return (
    <div>
      <p className="text-3xl">{count}</p>
      <br />
      <Button onClick={() => dispatch(increment())}>Increment</Button>
      <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      <Button onClick={() => dispatch(reset())}>Reset</Button>
    </div>
  );
};

export default Test;
