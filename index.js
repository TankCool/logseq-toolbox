function insertRandomQuote(currentBlock) {
  axios.get("https://api.quotable.io/quotes/random").then((res) => {
    console.log(res);
    const quotes = res.data
    console.log(quotes)
    if (quotes.length > 0) {
      const content = `
#+BEGIN_TIP
${quotes[0].content}  [[${quotes[0].author}]]
#+END_TIP
`;
      insertContent(currentBlock, content);
    } else {
      logseq.App.showMsg("network error");
    }
  });
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
  const randomURL = "https://source.unsplash.com/featured/1080x720";
  axios.get(randomURL).then((data) => {
    const contentToInsert = `![unsplash-random-pic-${new Date().toString()}](${data.request.responseURL})`;
    insertContent(currentBlock, contentToInsert);
  });
}

function main() {

  logseq.Editor.registerSlashCommand("toolbox-random-quote", async () => {
    const currentBlock = await logseq.Editor.getCurrentBlock();
    insertRandomQuote(currentBlock);
  });

  logseq.Editor.registerSlashCommand("toolbox-progress-bar", [
    ["editor/input", '<progress value="42" max="100"/>', {"backward-pos": 13}],
  ])

  logseq.Editor.registerSlashCommand("toolbox-random-picture", async () => {
    const currentBlock = await logseq.Editor.getCurrentBlock();
    insertRandomPic(currentBlock);
  });
}
logseq.ready(main).catch(console.error);
