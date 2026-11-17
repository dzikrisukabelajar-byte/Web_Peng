(function(){
  var KEY = "pencatat-pengeluaran-v1";
  var CATS = {
    out: ["Makan", "Transport", "Belanja", "Tagihan", "Hiburan", "Lainnya"],
    in: ["Gaji", "Bonus", "Transfer", "Lainnya"]
  };
  var type = "out";
  var items = load();

  var $ = function(id){ return document.getElementById(id); };

  function load(){
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function save(){
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }
  function rp(n){
    return "Rp" + Math.round(n).toLocaleString("id-ID");
  }
  function fillCats(){
    var sel = $("kat");
    sel.innerHTML = "";
    CATS[type].forEach(function(c){
      var o = document.createElement("option");
      o.value = c; o.textContent = c;
      sel.appendChild(o);
    });
  }
  function render(){
    var masuk = 0, keluar = 0;
    items.forEach(function(it){
      if (it.t === "in") masuk += it.n; else keluar += it.n;
    });
    $("saldo").textContent = (masuk - keluar < 0 ? "-" : "") + rp(Math.abs(masuk - keluar));
    $("masuk").textContent = rp(masuk);
    $("keluar").textContent = rp(keluar);

    var ul = $("list");
    ul.innerHTML = "";
    items.slice().reverse().forEach(function(it){
      var li = document.createElement("li");
      var info = document.createElement("div");
      info.className = "info";
      var b = document.createElement("b");
      b.textContent = it.k || it.c;
      var s = document.createElement("small");
      var d = new Date(it.d);
      s.textContent = it.c + ", " + d.toLocaleDateString("id-ID", {day:"numeric", month:"short"});
      info.appendChild(b); info.appendChild(s);

      var a = document.createElement("span");
      a.className = "amt " + it.t;
      a.textContent = (it.t === "in" ? "+" : "-") + rp(it.n);

      var x = document.createElement("button");
      x.type = "button"; x.className = "del";
      x.setAttribute("aria-label", "Hapus catatan");
      x.textContent = "✕";
      x.addEventListener("click", function(){
        items = items.filter(function(i){ return i.id !== it.id; });
        save(); render();
      });
      li.appendChild(info); li.appendChild(a); li.appendChild(x);
      ul.appendChild(li);
    });
    $("empty").style.display = items.length ? "none" : "block";
  }

  document.querySelectorAll("#toggle button").forEach(function(btn){
    btn.addEventListener("click", function(){
      type = btn.getAttribute("data-t");
      document.querySelectorAll("#toggle button").forEach(function(o){
        o.classList.toggle("on", o === btn);
      });
      fillCats();
    });
  });

  $("nominal").addEventListener("input", function(e){
    var digits = e.target.value.replace(/\D/g, "");
    e.target.value = digits ? Number(digits).toLocaleString("id-ID") : "";
  });

  function add(){
    var n = Number($("nominal").value.replace(/\D/g, ""));
    if (!n) { $("err").textContent = "Isi nominal dulu, minimal Rp1."; return; }
    $("err").textContent = "";
    items.push({
      id: Date.now(),
      t: type,
      n: n,
      k: $("ket").value.trim(),
      c: $("kat").value,
      d: new Date().toISOString()
    });
    save();
    $("nominal").value = ""; $("ket").value = "";
    render();
  }
  $("add").addEventListener("click", add);
  ["nominal", "ket"].forEach(function(id){
    $(id).addEventListener("keydown", function(e){ if (e.key === "Enter") add(); });
  });

  $("reset").addEventListener("click", function(){
    if (!items.length) return;
    if (confirm("Hapus semua catatan? Ini tidak bisa dibatalkan.")) {
      items = []; save(); render();
    }
  });

  fillCats();
  render();
})();

const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'doughnut', 
    data: {
        labels: ['Makan', 'Transport', 'Belanja', 'Tagihan', 'Hiburan', 'Lainnya'], 
        datasets: [{
            label: 'Total Pengeluaran (Rp)',
            data: [0, 0, 0, 0, 0, 0], 
            backgroundColor: [
                '#ff6384',
                '#36a2eb',
                '#cc65fe',
                '#ffce56'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#fff' 
                }
            }
        }
    }
});

function updateChart(kategori, nominal) {
}