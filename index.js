function insertDailyQuote(currentBlock) {
  axios.get("https://quotes.rest/qod?language=en").then((res) => {
    const {contents:{quotes}} = res.data
    if (quotes.length > 0) {
      const content = `
#+BEGIN_TIP
${quotes[0].quote}  *${quotes[0].author}*
#+END_TIP
`;
      insertContent(currentBlock, content);
    } else {
      logseq.App.showMsg("network error");
    }
  });
}

function insertProgressBar(currentBlock) {
  const content = '<progress value="42" max="100" />';
  insertContent(currentBlock, content);
}

async function insertContent(currentBlock, content) {
  if (currentBlock.content) {
    await logseq.Editor.insertBlock(currentBlock.uuid, content);
  } else {
    await logseq.Editor.insertAtEditingCursor(content);
  }
  logseq.Editor.exitEditingMode({ selectBlock: true });
}

function insertRandomPic(currentBlock) {
  const randomURL = "https://source.unsplash.com/random/1080x720";
  axios.get(randomURL).then((data) => {
    const contentToInsert = `![unsplash-random-pic-${new Date().toString()}](${data.request.responseURL})`;
    insertContent(currentBlock, contentToInsert);
  });
}

function main() {

  logseq.Editor.registerSlashCommand("toolbox-daily-quote", async () => {
    const currentBlock = await logseq.Editor.getCurrentBlock();
    insertDailyQuote(currentBlock);
  });

  logseq.Editor.registerSlashCommand("toolbox-progress-bar", async () => {
    const currentBlock = await logseq.Editor.getCurrentBlock();
    insertProgressBar(currentBlock);
  });

  logseq.Editor.registerSlashCommand("toolbox-random-picture", async () => {
    const currentBlock = await logseq.Editor.getCurrentBlock();
    insertRandomPic(currentBlock);
  });
}
logseq.ready(main).catch(console.error);
