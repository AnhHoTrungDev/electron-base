const { ipcRenderer } = window.require("electron");

const sendCommandToPrint = (html, printDriver) => {
  console.log({ html, printDriver });
  try {
    ipcRenderer.send("print", {
      html,
      printDriver,
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export const print = async (content = "hello", printDriver = "") => {
  const html = `<h1>${content}</h1>`;
  sendCommandToPrint(html, printDriver);
};
