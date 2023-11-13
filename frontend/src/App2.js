import React from "react";
import { VictoryPie, VictoryTheme } from "victory";

const App2 = () => {
  const data = [
    { x: "Red", y: 12 },
    { x: "Blue", y: 19 },
    { x: "Yellow", y: 3 },
    { x: "Green", y: 5 },
    { x: "Purple", y: 2 },
    { x: "Orange", y: 3 },
  ];

  return (
    <div style={{ color: "black", textAlign: "center" }}>
      <div style={{ width: 300, height: 300, margin: "auto" }}>
        {/* Adjust the width and height here */}
        <VictoryPie
          data={data}
          theme={VictoryTheme.material}
          width={300}
          height={300}
        />
      </div>
      <div>Colors</div>
    </div>
  );
};

export default App2;
