const content = `
<tr>
  <td><span style = "font-size:12px">20CSE103</span></td>
  <td><span style = "font-size:12px">Data Structures</span></td>
  <td><span style = "font-size:12px">Dr. Smith, Ph.D.</br>Email:<a href="mailto:smith@mits.ac.in">smith@mits.ac.in</a></td>
</tr>
<tr>
  <td><span style = "font-size:12px">20CSE104</span></td>
  <td><span style = "font-size:12px">Database Management</span></td>
  <td><span style = "font-size:12px">Prof. Jones</span></td>
</tr>
`;

const subMetaRegex = /<span style = "font-size:12px">\s*([A-Za-z0-9\-]+)\s*<\/span>[\s\S]*?<span style = "font-size:12px">\s*([^<]+?)\s*<\/span>[\s\S]*?<span style = "font-size:12px">\s*([^<]+?)\s*(?:<\/br>|<br\s*\/?>|\n|\r)*(?:Email:\s*<a href="mailto:([^"]+)">)?/gi;

let metaMatch;
while ((metaMatch = subMetaRegex.exec(content)) !== null) {
  console.log("MATCH:", metaMatch[1], metaMatch[2], metaMatch[3], metaMatch[4]);
}

const attContent = `
<tr>
  <td><span style = "font-size:12px">20CSE103</span></td>
  <td><span style = "padding: 50px">34</span></td>
  <td><span style = "padding: 42px">40</span></td>
  <td><span style = "padding: 38px">85.0</span></td>
</tr>
`;

const attRowRegex = /<span[^>]*font-size:12px[^>]*>\s*([A-Za-z0-9\-]+)\s*<\/span>[\s\S]*?<span[^>]*padding:\s*\d+px[^>]*>\s*(\d+)\s*<\/span>[\s\S]*?<span[^>]*padding:\s*\d+px[^>]*>\s*(\d+)\s*<\/span>[\s\S]*?<span[^>]*padding:\s*\d+px[^>]*>\s*([\d\.]+)\s*<\/span>/gi;

let rowMatch;
while ((rowMatch = attRowRegex.exec(attContent)) !== null) {
  console.log("ROW MATCH:", rowMatch[1], rowMatch[2], rowMatch[3], rowMatch[4]);
}
