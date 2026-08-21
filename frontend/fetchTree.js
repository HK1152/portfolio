import https from 'https';

https.get('https://api.github.com/repos/DavidHDev/react-bits/git/trees/main?recursive=1', {
  headers: { 'User-Agent': 'Node.js' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.tree) {
        const matches = parsed.tree
          .filter(t => t.path.toLowerCase().includes('aurora') || t.path.toLowerCase().includes('colorbend') || t.path.toLowerCase().includes('color') || t.path.toLowerCase().includes('bend'))
          .map(t => t.path);
        console.log("Matches:", matches);
      } else {
        console.log("No tree found in response:", parsed);
      }
    } catch(e) {
      console.log(e.message);
    }
  });
});
