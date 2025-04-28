document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createGuideForm");
    const guideTable = document.getElementById("packetTable");
    const gRegister = document.querySelector('.mainItemsContainer');
    const gInfoTotal = document.querySelector('.guideTotal');
    const gInfoTransit = document.querySelector('.guideTransit');
    const gInfoCompleted = document.querySelector('.guideCompleted');
    
    
    if (form){
        form.addEventListener('submit',function(event){
            event.preventDefault();

            const gNumber = document.getElementById('guideNumber').value;
            const gPacketFrom = document.getElementById('guideFrom').value;
            const gPacketTo = document.getElementById('guideTo').value;
            const gPacketDate = document.getElementById('guideDate').value;
            const gStatus = document.getElementById('guideStatus').value;

            let guideData = JSON.parse(localStorage.getItem('formData')) || [];
            
            guideData.push({gNumber, gPacketFrom, gPacketTo, gPacketDate, gStatus});

            localStorage.setItem('formData', JSON.stringify(guideData));

            window.location.href = "guideList.html";
        });
    };

    if (guideTable){
        const guideData = JSON.parse(localStorage.getItem('formData')) || [];
        const tableBody = guideTable.getElementsByTagName('tbody')[0];
    
        guideData.forEach((item, index) => {
            const tableRow = tableBody.insertRow();
    
            // Crear celdas
            const cellGNumber = tableRow.insertCell(0);
            const cellGPacketStatus = tableRow.insertCell(1);
            const cellGPacketFrom = tableRow.insertCell(2);
            const cellGPacketTo = tableRow.insertCell(3);
            const cellGPacketDate = tableRow.insertCell(4);
            const cellUpdate = tableRow.insertCell(5);
            const cellHistory = tableRow.insertCell(6);
    
            // Asignar valores
            cellGNumber.textContent = item.gNumber;
            cellGPacketStatus.textContent = item.gStatus;
            cellGPacketFrom.textContent = item.gPacketFrom;
            cellGPacketTo.textContent = item.gPacketTo;
            cellGPacketDate.textContent = item.gPacketDate;
    
            // Crear el formulario de actualización
            const form = document.createElement('form');
    
            const select = document.createElement('select');
            select.className = "selectEstado";
            select.name = "estado";
    
            // Opciones del select
            const estados = ["En recolección", "En tránsito", "En preparación", "Entregada"];
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado;
                option.textContent = estado;
                if (estado.toLowerCase() === item.gStatus.toLowerCase()) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
    
            const updateButton = document.createElement('button');
            updateButton.type = "submit";
            updateButton.textContent = "Actualizar";
    
            form.appendChild(select);
            form.appendChild(updateButton);
            cellUpdate.appendChild(form);
    
            // Botón de ver historial
            const historyButton = document.createElement('button');
            historyButton.textContent = "Ver historial";
            cellHistory.appendChild(historyButton);

            // Acción cuando den click en el botón "Ver historial"
            historyButton.addEventListener('click', () => {
            localStorage.setItem('selectedGuide', JSON.stringify(item)); // Guarda la guía seleccionada
            window.location.href = 'guideHistory.html'; // Redirige a la página de historial
            });
    
            // Acción cuando actualicen
            form.addEventListener('submit', (event) => {
                event.preventDefault();
    
                const nuevoEstado = select.value;
    
                // Cambiar el texto de la columna de Estado Actual
                cellGPacketStatus.textContent = nuevoEstado;
    
                // También actualizar en localStorage
                guideData[index].gStatus = nuevoEstado;
                localStorage.setItem('formData', JSON.stringify(guideData));
            });
        });
    };

    if(gRegister){
        const guideTotalData = JSON.parse(localStorage.getItem('formData')) || [];
        guideTotalData.forEach((item) => {
            const totalPackets = guideTotalData.length;
            gInfoTotal.textContent = totalPackets;
            const guideInTransit = guideTotalData.map(item => item.gStatus).filter(status => status === "En tránsito").length;
            gInfoTransit.textContent = guideInTransit;
            const guideCompleted = guideTotalData.map(item => item.gStatus).filter(status => status === "Entregada").length;
            gInfoCompleted.textContent = guideCompleted;
        });
    };
    // ===============================
    // Mostrar datos en guideHistory.html
    if (document.querySelector('.guideHistoryContainer')) {
        const guideData = JSON.parse(localStorage.getItem('selectedGuide'));

    if (guideData) {
        const container = document.querySelector('.guideHistoryContainer');

        container.innerHTML = `
            <h2>Consulta el historial de tu Guía</h2>
            <h3>Pedido con la guía: #${guideData.gNumber}.</h3>
            <p>Estado actual: <span class="guideTracker">${guideData.gStatus}</span></p>
            <p>Fecha estimada de entrega: <span class="guideETA">Próximamente</span></p>
            <h4>Historial del paquete:</h4>
            <p>${guideData.gPacketDate} - Generación de Guía para transportar - ${guideData.gPacketFrom}</p>
            <p>${guideData.gPacketDate} - Generada recolección del paquete - ${guideData.gPacketFrom}</p>
            <p>${guideData.gPacketDate} - Se inicia ruta para recolección del paquete - ${guideData.gPacketFrom}</p>
        `;
    } else {
            alert("No hay historial disponible para esta guía.");
        }
    }

});    