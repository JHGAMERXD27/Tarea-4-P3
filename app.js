let users = JSON.parse(localStorage.getItem('users')) || [];
const form = document.getElementById('crud-form');
const userList = document.getElementById('user-list');
const saveBtn = document.getElementById('save-btn');

// --- LÓGICA DE LOGIN ---
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const crudSection = document.getElementById('crud-section');
const loginError = document.getElementById('login-error');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;

        // Validación sencilla para cumplir con el requisito
        if (user === 'admin' && pass === 'Qu3Dur@123') {
            loginSection.style.display = 'none';
            crudSection.style.display = 'block';
            loginError.style.display = 'none';
            renderTable(); // Cargamos la tabla al entrar
        } else {
            loginError.style.display = 'block';
        }
    });
}
// -----------------------

// C - CREATE & U - UPDATE
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const idInput = document.getElementById('user-id').value;
    const nameInput = document.getElementById('user-name').value.trim();
    const emailInput = document.getElementById('user-email').value.trim();
    
    if (nameInput.length > 100) {
    alert("El nombre no puede tener más de 100 caracteres.");
    return;
}
    if (idInput) {
        // UPDATE (Actualizar)
        // verifico correo
        // Validación adicional por seguridad
        if (nameInput.length > 100) {
            alert("El nombre no puede tener más de 100 caracteres.");
            return;
        }
        const emailExists = users.some(u => u.email.toLowerCase() === emailInput.toLowerCase() && u.id !== idInput);
        
        if (emailExists) {
            alert('Error: Este correo ya está siendo utilizado por otro usuario.');
            return; 
        }

        const index = users.findIndex(u => u.id == idInput);
        users[index] = { id: idInput, name: nameInput, email: emailInput };
        saveBtn.textContent = 'Guardar Usuario'; 
    } else {
        // CREATE (Crear)
        // Validación adicional por seguridad
        if (nameInput.length > 100) {
            alert('El nombre no puede tener más de 100 caracteres.');
            return;
        }
        // Validación de duplicados
        const emailExists = users.some(u => u.email.toLowerCase() === emailInput.toLowerCase());
        
        if (emailExists) {
            alert('Error: Ya existe un usuario registrado con este correo electrónico.');
            return; // Detiene la función para no crear el duplicado
        }

        const newUser = {
            id: Date.now().toString(),
            name: nameInput,
            email: emailInput
        };
        users.push(newUser);
    }

    saveData();
    form.reset();
    document.getElementById('user-id').value = '';
    renderTable();
});

// R - READ
function renderTable() {
    userList.innerHTML = '';
    
    if (users.length === 0) {
        userList.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#888;">No hay usuarios registrados.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td class="action-btns">
                <button class="btn-edit" onclick="editUser('${user.id}')">Editar</button>
                <button class="btn-delete" onclick="deleteUser('${user.id}')">Eliminar</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

// Preparar formulario para UPDATE
function editUser(id) {
    const user = users.find(u => u.id === id);
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    saveBtn.textContent = 'Actualizar Usuario'; 
}

// D - DELETE
function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (confirm(`¿Estás seguro de que deseas eliminar a ${user.name}?`)) {
        users = users.filter(u => u.id !== id);
        saveData();
        renderTable();
    }
}

// Guardar en localStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Renderizar al iniciar
