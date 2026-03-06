let data = [];
const api = 'http://127.0.0.1:8000/workouts';
let workoutIdInEdit = 0;

document.getElementById('add-btn').addEventListener('click', (e) => {
  e.preventDefault();

  const msgDiv = document.getElementById('msg');
  const dayInput = document.getElementById('day');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('desc');

  if (!dayInput.value || !titleInput.value || !descInput.value) {
    msgDiv.innerHTML =
      'Please provide non-empty Day, Title, and Description when creating a new Workout';
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 201) {
      const newWorkout = JSON.parse(xhr.response);
      data.push(newWorkout);
      renderWorkouts(data);

      const closeBtn = document.getElementById('close-add-modal');
      closeBtn.click();

      msgDiv.innerHTML = '';
      dayInput.value = '';
      titleInput.value = '';
      descInput.value = '';
    }
  };

  xhr.open('POST', api, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(
    JSON.stringify({
      day: dayInput.value,
      title: titleInput.value,
      desc: descInput.value,
    })
  );
});

document.getElementById('edit-btn').addEventListener('click', (e) => {
  e.preventDefault();

  const msgDiv = document.getElementById('msgEdit');
  const dayInput = document.getElementById('dayEdit');
  const titleInput = document.getElementById('titleEdit');
  const descInput = document.getElementById('descEdit');

  if (!dayInput.value || !titleInput.value || !descInput.value) {
    msgDiv.innerHTML =
      'Please provide non-empty Day, Title, and Description when updating a Workout';
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      const newWorkout = JSON.parse(xhr.response);
      const workout = data.find((x) => x.id == workoutIdInEdit);
      workout.day = newWorkout.day;
      workout.title = newWorkout.title;
      workout.desc = newWorkout.desc;
      renderWorkouts(data);

      const closeBtn = document.getElementById('close-edit-modal');
      closeBtn.click();

      msgDiv.innerHTML = '';
      dayInput.value = '';
      titleInput.value = '';
      descInput.value = '';
    }
  };

  xhr.open('PUT', api + '/' + workoutIdInEdit, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(
    JSON.stringify({
      day: dayInput.value,
      title: titleInput.value,
      desc: descInput.value,
    })
  );
});

function deleteWorkout(id) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200) {
      data = data.filter((x) => x.id != id);
      renderWorkouts(data);
    }
  };

  xhr.open('DELETE', api + '/' + id, true);
  xhr.send();
}

function setWorkoutInEdit(id) {
  workoutIdInEdit = id;
  const workout = data.find((x) => x.id == id);

  document.getElementById('dayEdit').value = workout.day;
  document.getElementById('titleEdit').value = workout.title;
  document.getElementById('descEdit').value = workout.desc;
  document.getElementById('msgEdit').innerHTML = '';
}

function renderWorkouts(data) {
  const workoutDiv = document.getElementById('workouts');
  workoutDiv.innerHTML = '';
  data
    .sort((a, b) => b.id - a.id)
    .forEach((x) => {
      workoutDiv.innerHTML += `
    <div id="workout-${x.id}" class="workout-box">
        <div class="fw-bold fs-5 text-success">${x.day}</div>
        <div class="fw-bold fs-4">${x.title}</div>
        <pre class="text-secondary ps-3">${x.desc}</pre>
        <div>
          <button type="button" class="btn btn-success btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
            onClick="setWorkoutInEdit(${x.id})"
          >
            Edit
          </button>
          <button type="button" class="btn btn-danger btn-sm"
            onClick="deleteWorkout(${x.id})"
          >
            Delete
          </button>
        </div>
    </div>
    `;
    });
}

function getAllWorkouts() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200) {
      data = JSON.parse(xhr.response) || [];
      renderWorkouts(data);
    }
  };

  xhr.open('GET', api, true);
  xhr.send();
}

(() => {
  getAllWorkouts();
})();