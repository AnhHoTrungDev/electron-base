import React, { useState, useEffect } from "react";
import { print } from "@common/print";
import { Select } from "antd";
const { ipcRenderer } = window.require("electron");

const { Option } = Select;

const ListPrint = () => {
  const [listOfPrintDriver, setListOfPrintDriver] = useState([]);
  const [printName, setPrintName] = useState("");
  const handleChangePrint = (value) => {
    console.log("handleChangePrint value", value);
    setPrintName(value);
  };

  useEffect(() => {
    ipcRenderer.send("main-window-ready");

    ipcRenderer.on("get-print-driver", (_, content) => {
      setListOfPrintDriver(content);
      console.log("content :>> ", content);
    });
  }, []);

  console.log("handleChangePrint value", printName);

  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            print(undefined, printName);
          }}
        >
          print
        </button>
        <Select
          // mode="multiple"
          placeholder="Chọn máy in"
          onChange={handleChangePrint}
          style={{ width: "100%" }}
        >
          {listOfPrintDriver?.map((print) => {
            return (
              <Option
                key={print?.options?.system_driverinfo}
                value={print?.name}
              >
                {print?.name}
              </Option>
            );
          })}
        </Select>
      </header>
    </div>
  );
};

export default ListPrint;
