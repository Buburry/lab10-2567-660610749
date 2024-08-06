"use client";

import axios from "axios";
import { useState,useEffect } from "react";
import { cleanUser } from "@/libs/cleanUser";
import UserCard from "@/components/UserCard";
import { UserCardProps } from "@/libs/types";

export default function RandomUserPage() {
  // annotate type for users state variable
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [isfisrtload, setIsfirstload] = useState(true);
  
  useEffect(() => {
    if(isfisrtload){
      setIsfirstload(false);
      return; 
    }
    const jsonStr = JSON.stringify(genAmount);
    localStorage.setItem("genAmount",jsonStr);
  },[genAmount]);

  useEffect(() => {
    const jsonStr = localStorage.getItem("genAmount");
    if (jsonStr !== null) {
      const newgenAmount = JSON.parse(jsonStr);
      setGenAmount(newgenAmount);
    }
  },[]);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;

    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    const cleanedUsers = users.map((user:string) => {
      return cleanUser(user);
    });
    //Then update state with function : setUsers(...)
    setUsers(cleanedUsers);
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(Number(e.target.value))}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((user:UserCardProps) => {
        return (
          <UserCard key={user.email}
          name={user.name}
          imgUrl={user.imgUrl}
          address={user.address}
          email={user.email} />
        );
      })}
    </div>
  );
}
