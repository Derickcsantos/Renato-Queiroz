// Script para abrir o menu no mobile
document.getElementById("menu-icon").addEventListener("click", function(event) {
    // Impede que o clique no ícone de menu feche o sidebar
    event.stopPropagation();
    
    const menuSidebar = document.getElementById("menu-sidebar");
    menuSidebar.classList.toggle("open");
});

// Fecha o sidebar se o usuário clicar fora dele
document.addEventListener("click", function(event) {
    const menuSidebar = document.getElementById("menu-sidebar");
    const menuIcon = document.getElementById("menu-icon");
    
    // Verifica se o clique ocorreu fora do sidebar e do ícone do menu
    if (!menuSidebar.contains(event.target) && event.target !== menuIcon) {
        menuSidebar.classList.remove("open");
    }
});

document.getElementById('closebtn').addEventListener('click', function() {
    document.getElementById('menu-sidebar').classList.remove('open');
});

// Fecha o sidebar ao clicar em qualquer item do menu
document.querySelectorAll("#menu-sidebar a").forEach(function(link) {
    link.addEventListener("click", function() {
        document.getElementById("menu-sidebar").classList.remove("open");
    });
});


