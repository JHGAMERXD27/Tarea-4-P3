const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

describe('Pruebas Automatizadas CRUD - Tarea 4', function() {
    this.timeout(30000)
    let driver;
    const url = 'http://127.0.0.1:5500/'; 

    // Función auxiliar para pasar el login en las pruebas de CRUD
    async function iniciarSesion() {
        await driver.findElement(By.id('login-username')).sendKeys('admin');
        await driver.findElement(By.id('login-password')).sendKeys('Qu3Dur@123');
        await driver.findElement(By.id('login-btn')).click();
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('crud-section'))), 5000);
    }

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async function() {
        let image = await driver.takeScreenshot();
        let nombrePrueba = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
        let carpetaDestino = path.join(__dirname, 'ss de pruebas');

        if (!fs.existsSync(carpetaDestino)) {
            fs.mkdirSync(carpetaDestino, { recursive: true });
        }

        let ruta = path.join(carpetaDestino, `${nombrePrueba}.png`);
        fs.writeFileSync(ruta, image, 'base64');
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    // --- PRUEBAS DE LOGIN ---
    it('Login Negativo: Debería fallar con credenciales incorrectas', async function() {
        await driver.get(url);
        await driver.findElement(By.id('login-username')).sendKeys('hacker');
        await driver.findElement(By.id('login-password')).sendKeys('0000');
        await driver.findElement(By.id('login-btn')).click();
        
        let errorMsg = await driver.wait(until.elementLocated(By.id('login-error')), 5000);
        await driver.wait(until.elementIsVisible(errorMsg), 5000);
    });

    it('Login Positivo: Debería iniciar sesión correctamente', async function() {
        await driver.get(url);
        await iniciarSesion();
    });

    // --- PRUEBAS CRUD ---
    it('Camino Positivo: Debería crear un usuario correctamente', async function() {
        await driver.get(url);
        await iniciarSesion(); // Pasamos el login primero
        
        await driver.findElement(By.id('user-name')).sendKeys('Jheriel Alberto');
        await driver.findElement(By.id('user-email')).sendKeys('jheriel@itla.edu.do');
        await driver.findElement(By.id('save-btn')).click();
        
        await driver.wait(until.elementLocated(By.css('#user-list tr')), 5000);
    });

    it('Prueba Negativa: Debería fallar al intentar guardar sin datos', async function() {
        await driver.get(url);
        await iniciarSesion();
        
        await driver.findElement(By.id('user-name')).clear();
        await driver.findElement(By.id('user-email')).clear();
        await driver.findElement(By.id('save-btn')).click();
    });

    it('Prueba de Límites: No debería permitir un nombre mayor de 100 caracteres', async function() {
        await driver.get(url);
        await iniciarSesion();
        
        let textoLargo = 'a'.repeat(100); 
        await driver.findElement(By.id('user-name')).sendKeys(textoLargo);
        await driver.findElement(By.id('user-email')).sendKeys('limite@ejemplo.com');
        await driver.findElement(By.id('save-btn')).click();
    });

    it('Debería actualizar un registro', async function() {
        await driver.get(url);
        await iniciarSesion();
        
        await driver.findElement(By.id('user-name')).sendKeys('Usuario Viejo');
        await driver.findElement(By.id('user-email')).sendKeys('viejo@test.com');
        await driver.findElement(By.id('save-btn')).click();
        
        let btnEditar = await driver.wait(until.elementLocated(By.css('#user-list .btn-edit')), 5000);
        await btnEditar.click();
        
        let inputNombre = await driver.findElement(By.id('user-name'));
        await inputNombre.clear();
        await inputNombre.sendKeys('Usuario Actualizado');
        await driver.findElement(By.id('save-btn')).click();
    });

    it('Debería eliminar un registro', async function() {
        await driver.get(url);
        await iniciarSesion();
        
        await driver.findElement(By.id('user-name')).sendKeys('Para Borrar');
        await driver.findElement(By.id('user-email')).sendKeys('borrar@test.com');
        await driver.findElement(By.id('save-btn')).click();
        
        let btnEliminar = await driver.wait(until.elementLocated(By.css('#user-list .btn-delete')), 5000);
        await btnEliminar.click();
        
        await driver.wait(until.alertIsPresent(), 5000);
        let alerta = await driver.switchTo().alert();
        await alerta.accept(); 
    });
});
