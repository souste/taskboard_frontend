import { useState, useEffect } from "react";

type Columns = {
  id: number;
  user_id: number;
  name: string;
  position: number;
  created_at: string;
};

export default function Columns() {
  const [columns, setColumns] = useState([]);

  return (
    <>
      <h2>Columns</h2>
    </>
  );
}
