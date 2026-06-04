document.getElementById("cep").addEventListener("blur", function() {
  let cep = this.value.replace(/\D/g, '');

  if (cep.length !== 8) {
    alert("CEP inválido");
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }

      document.getElementById("rua").value = data.logradouro;
      document.getElementById("bairro").value = data.bairro;
      document.getElementById("cidade").value = data.localidade;
      document.getElementById("estado").value = data.uf;
    })
    .catch(() => {
      alert("Erro ao buscar CEP");
    });
});
