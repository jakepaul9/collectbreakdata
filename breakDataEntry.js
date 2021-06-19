let punches = [];
let empOptions = "";

for (emp of names) {
  empOptions += `<option value="${emp.toLowerCase()}">${emp}</option>`;
  punches.push({
    name: emp.toLowerCase(),
    punches: [{ date: "", task: "", start: 0, end: 0, duration: 0 }],
  });
}
if (localStorage.getItem("employees") === null) {
  localStorage.setItem("employees", JSON.stringify(punches));
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const startDT = () => {
  let employee = document.getElementById("dt-name").value;
  let task = document.getElementById("dt-task").value;

  let employees = JSON.parse(localStorage.getItem("employees"));
  for (emp of employees) {
    if (employee == emp.name) {
      if (emp.punches.length > 0) {
        let plen = emp.punches.length - 1;
        let e = emp.punches;
        console.log(emp.punches[plen].task);
        if (e[plen].duration > 0) {
          e.push({
            date: new Date(),
            task: task,
            start: Date.now(),
            end: 0,
            duration: 0,
          });
        } else if (e[plen].duration === 0 && e[plen].start === 0) {
          (e[plen].date = new Date()),
            (e[plen].task = task),
            (e[plen].end = 0),
            (e[plen].start = Date.now()),
            (e[plen].duration = 0);
        } else {
            let newDate = new Date(e[plen].start);
            let datestr = `${newDate.toDateString()} ${newDate.toTimeString()}`;
          alert(`You Haven't ended your last punch you started at \n${datestr}`);
        }
      }
    }
  }

  localStorage.setItem("employees", JSON.stringify(employees));
};

const endDT = () => {
  let employee = document.getElementById("dt-name").value;
  let task = document.getElementById("dt-task").value;

  let employees = JSON.parse(localStorage.getItem("employees"));
  for (emp of employees) {
    if (employee == emp.name) {
      if (emp.punches.length > 0) {
        let plen = emp.punches.length - 1;
        let e = emp.punches;

        e[plen].duration === 0 && e[plen].start !== 0
          ? ((e[plen].end = Date.now()),
            (e[plen].duration = e[plen].end - e[plen].start))
          : alert("You haven't started a punch to end yet!");
      }
    }
  }

  localStorage.setItem("employees", JSON.stringify(employees));
};

let container = document.createElement("div");
container.id = "hello";
container.setAttribute(
  "style",
  `
    display:flex;
    flex-direction:column;
    align-items:center;
    color:red; 
    width:100%; 
    height:100vh; 
    background-color:white; 
    z-index:999; 
    position:fixed;
    margin:auto;`
);

container.innerHTML = `
  <h1 id='dt-title'>Downtime Check</h1>
  <div id='dt-form' style="min-width:400px;padding:30px;background-color:gray;border-radius:20px;color:white">
    <div style="">
      <h3>Name</h3>
      <select name="dt-name" id="dt-name" style="border-radius:5px;margin-bottom:20px;">
      ${empOptions}
      </select>
    </div>
    <div style="">
      <h3>Current Task</h3>
      <select name="dt-task" id="dt-task" style="border-radius:5px;">
        <option value="picking">Picking</option>
        <option value="packing">Packing</option>
      </select>
    </div>
    <div style="width:100%;margin-top:40px;display:flex;align-items:center;justify-content:space-between;">
      <button id='dt-start' onclick="startDT()" style="width:45%; padding:0px; height:80px;background-color:white;color:green;border:3px solid green;border-radius:10px;text-align:center;">START</button>
      <button id='dt-end' onclick="endDT()" style="width:45%; padding:0px; height:80px;background-color:white;color:red;border:3px solid red;border-radius:10px;text-align:center;">END</button>
    </div>
    <div style="width:100%;display:flex;justify-content:center;margin-top:40px;">
      <button id='dt-eofd' style="margin:auto;width:40%; padding:0px; height:50px;background-color:black;color:white;border:3px solid black;border-radius:10px;text-align:center;">End of Day</button>
    </div>
  </div>
`;
document.body.prepend(container);
// $('<style>').text(css).appendTo(document.head)

document.getElementById('dt-eofd').addEventListener('click', () => {
  console.log('here')
  let access = prompt("Password")
  if(access == 'Farid'){
    let employees = JSON.parse(localStorage.getItem("employees"));
    let output ='Name,Date,Task,Duration\n'
    for(emp of employees){
        for(p of emp.punches){
          if(p.date != ''){
            let date1 = new Date(p.date);
            let day1 = `${date1.getMonth()}/${date1.getDate()}/${date1.getFullYear()}`
            output += `${emp.name},${day1},${p.task},${Number(((p.duration/1000)/3600).toFixed(2))}\n`
          }
        }
    }
    let date2 = new Date();
    let day2 = `${date2.getMonth()}-${date2.getDate()}-${date2.getFullYear()}`
    download(`BreakData_${day2}.csv`, output)
    alert('Data Downloaded and Cache Cleared')
    localStorage.setItem("employees", JSON.stringify(punches));
  }
})
