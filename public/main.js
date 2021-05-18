fetch('/tickets').then(res => {
    if(res.ok){
        return res.json();
    }
  })
  .then(respose => {
      respose.forEach(data => {
      // generating mobile table
        document.getElementById('tableBody2').innerHTML += `<tr class = "card">
        <td class="col-1">
        <span class = "${data.priority}-box"></span>
        </td>
        <td class="tableHeader col-12">
          <h4 class = "name">${data.name}</h4>
          <p class = "note">${data.ticketDetails}</p>
          <p class = "assigned">Assigned to ${data.assignedTo}</p>
          <p class = " status"> ${data.status}</p>
          <p class = "date">Ticket Submitted on ${data.requestedDate}</p>
        </td>
        <td class= "editButton col-1"><button class ="edit" title = "click to view detail" value = ${data._id}  onclick = "loadUpdateTicket(this)"><i class="glyphicon glyphicon-menu-right"></i></buton>
        </td>
        </tr>`;
        // generating desktop table 
        document.getElementById('tableBody').innerHTML += `<tr>
          <td class = "details col-5" >
            <h4 class = "name">${data.name}</h4>
            <p class = "note">${data.ticketDetails}</p>
            <p class = "date">Ticket Submitted on ${data.requestedDate}</p>
          </td>
          <td class = "Assigned col-2">${data.assignedTo}</td>
          <td class = " status col-2"> ${data.status}</td>
          <td class = "${data.priority} col-1">${data.priority}</td>
          <td class = "editButton col-2"><button class ="edit" title = "click to view detail" value = ${data._id} onclick = "loadUpdateTicket(this)">View Detail <i class="glyphicon glyphicon-menu-right"></i></buton></td>
        </tr>`
      });
  })

// need user info to autofil create ticket
fetch('/user').then(res=> res.json()).then(data=>{
  s_data= JSON.stringify(data)
  sessionStorage.setItem("user",s_data) 
})


// Climb up the document tree from the target of the event
function loadUpdateTicket(element) {
  console.log(element.value)
  sessionStorage.setItem("id",`${element.value}`);
  window.location.href='./update-ticket';
}

