const { ipcRenderer } = window.require("electron");

const sendCommandToWorker = (content) => {
  console.log(" sendCommandToWorker:>> ");
  console.log(content);
  try {
    ipcRenderer.send("print", content);
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export const print = async (content = "hello") => {
  console.log("run :>> ");
  console.log('content :>> ', content);
  const html = `<h1>${content}</h1>`;

  sendCommandToWorker(html);
};
