import React, { useState, useEffect, useCallback } from "react";
import { print } from "@common/print";
import { Select } from "antd";
import { useMutation, gql, useSubscription } from "@apollo/client";

const { ipcRenderer } = window.require("electron");

const UPDATE_PRINT = gql`
  mutation updatePrint($idRoom:String,$input:[PrintInfoInput]){
    updatePrint(idRoom:$idRoom,input:$input)
  }
`
const ACTION_SUB = gql` 
  subscription getAction($idRoom: String){
    getAction(idRoom:$idRoom){
      getPrints
      printPayload{
        content
        printName
      }
    }
  }
`

const { Option } = Select;

const ListPrint = () => {
  const [updatePrint, { data: abc }] = useMutation(UPDATE_PRINT);

  const { data: dataSub, loading, error } = useSubscription(ACTION_SUB, { variables: { idRoom: "abc" } })

  console.log({dataSub, loading, error})

  if (dataSub?.getAction) {
    const { getPrints, printPayload } = dataSub.getAction
    if (printPayload) {
      const { content, printName } = printPayload
      if (content) {
        print(content, printName)
      }
    }

    if (getPrints) {
      senPrints()
    }
  }

  // if (data?.getAction?.print) {
  //   console.log("run >>top  print")
  //   const printData = data?.getAction?.print
  //   if (printData?.content && printData?.printName) {
  //     console.log("run >> print")
  //     print(printData?.content, printData?.printName)
  //   }
  // }

  const [listOfPrintDriver, setListOfPrintDriver] = useState([]);
  const [printName, setPrintName] = useState("");
  const handleChangePrint = (value) => {
    console.log("handleChangePrint value", value);
    setPrintName(value);
  };

  const senPrints = useCallback(() => {
    ipcRenderer.send("main-window-ready");

    ipcRenderer.on("get-print-driver", (_, content) => {
      setListOfPrintDriver(content);
      console.log("content :>> ", content);

      const input = content.map((print) => {
        const { name } = print
        return { name }
      })

      updatePrint({
        variables: { idRoom: "abc", input }
      })
    })

  }, []);

  useEffect(() => {
    senPrints()
  }, [])

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
