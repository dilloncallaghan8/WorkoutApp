const API_BASE = 'http://127.0.0.1:8000';

function setMsg(text, isError = false) {
  const msg = document.getElementById('msg');
  msg.textContent = text;
  msg.className = isError ? 'small mt-2 text-danger' : 'small mt-2 text-success';
}

function escapeHtml(str) {
  return (str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderWorkouts(data) {
  const div = document.getElementById('workouts');
  div.innerHTML = '';

  if (!data || data.length === 0) {
    div.innerHTML = `<div class="text-secondary">No workouts yet.</div>`;
    return;
  }

  // Group by day (simple)
  const groups = {};
  data.forEach((w) => {
    const day = (w.day || '').trim() || 'Unassigned';
    if (!groups[day]) groups[day] = [];
    groups[day].push(w);
  });

  Object.keys(groups)
    .sort((a, b) => a.localeCompare(b))
    .forEach((day) => {
      div.innerHTML += `<div class="mt-3 fw-bold"><span class="day-pill">${escapeHtml(
        day
      )}</span></div>`;

      groups[day].forEach((w) => {
        div.innerHTML += `
          <div id="workout-${w.id}" class="workout-box">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div>
                <div class="fw-bold fs-5">${escapeHtml(w.title)}</div>
                <pre class="text-secondary ps-2 mb-0">${escapeHtml(w.notes)}</pre>
              </div>
              <div class="d-flex flex-column gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="editWorkout(${w.id})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteWorkout(${w.id})">Delete</button>
              </div>
            </div>
          </div>
        `;
      });
    });
}

function getAllWorkouts() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.response) || [];
      renderWorkouts(data);
    }
  };
  xhr.open('GET', `${API_BASE}/workouts`, true);
  xhr.send();
}


function addWorkout() {
  const day = document.getElementById('day').value.trim();
  const title = document.getElementById('title').value.trim();
  const notes = document.getElementById('notes').value.trim();

  if (!day || !title) {
    setMsg('Day and Title are required.', true);
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      setMsg('Workout added!');
      document.getElementById('title').value = '';
      document.getElementById('notes').value = '';
      // refresh list (keep day in the input for fast entry)
      getAllWorkouts();
    } else {
      setMsg(`Error adding workout (status ${xhr.status}).`, true);
    }
  };

  xhr.open('POST', `${API_BASE}/workouts`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ day, title, notes }));
}

function deleteWorkout(id) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      setMsg('Workout deleted.');
      getAllWorkouts();
    } else {
      setMsg(`Error deleting workout (status ${xhr.status}).`, true);
    }
  };
  xhr.open('DELETE', `${API_BASE}/workouts/${id}`, true);
  xhr.send();
}

function editWorkout(id) {
  // Basic edit using prompts to keep this project simple
  const newDay = prompt('New day? (e.g., Monday, Push Day)');
  if (newDay === null) return;

  const newTitle = prompt('New title? (e.g., Squat)');
  if (newTitle === null) return;

  const newNotes = prompt('New notes? (e.g., 5x5 @ 225)');
  if (newNotes === null) return;

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      setMsg('Workout updated!');
      getAllWorkouts();
    } else {
      setMsg(`Error updating workout (status ${xhr.status}).`, true);
    }
  };

  xhr.open('PUT', `${API_BASE}/workouts/${id}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(
    JSON.stringify({
      day: newDay.trim(),
      title: newTitle.trim(),
      notes: newNotes.trim(),
    })
  );
}


(() => {
  document.getElementById('addBtn').addEventListener('click', addWorkout);
  getAllWorkouts();
})();