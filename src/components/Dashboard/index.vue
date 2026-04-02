<template>
  <div class="admin-wrapper">

    <div class="stats-row">
      <div class="stat-card">
        <div class="icon-wrap"><i class="fa fa-random"></i></div>
        <div class="stat-value">65%</div>
        <div class="stat-label">Growth</div>
      </div>
      <div class="stat-card">
        <div class="icon-wrap"><i class="fa fa-user"></i></div>
        <div class="stat-value">15</div>
        <div class="stat-label">New Users</div>
      </div>
      <div class="stat-card">
        <div class="icon-wrap"><i class="fa fa-money"></i></div>
        <div class="stat-value">15,152</div>
        <div class="stat-label">Profit</div>
      </div>
    </div>

    <div class="middle-grid">
      <div class="quick-menu-grid">
        <div class="menu-item"><i class="fa fa-envelope"></i><span>Messages</span></div>
        <div class="menu-item"><i class="fa fa-users"></i><span>Clients</span></div>
        <div class="menu-item"><i class="fa fa-exchange"></i><span>Expenses</span></div>
        <div class="menu-item"><i class="fa fa-save"></i><span>Total Sales</span></div>
        <div class="menu-item"><i class="fa fa-bullhorn"></i><span>Social Feed</span></div>
        <div class="menu-item"><i class="fa fa-caret-down"></i><span>Bounce Rate</span></div>
      </div>

      <div class="card progress-card">
        <div class="prog-item">
          <div class="prog-label">Windows 8 <span class="pull-right">78%</span></div>
          <div class="bar"><div class="fill bg-blue" style="width: 78%"></div></div>
        </div>
        <div class="prog-item">
          <div class="prog-label">Mac <span class="pull-right">56%</span></div>
          <div class="bar"><div class="fill bg-green" style="width: 56%"></div></div>
        </div>
        <div class="prog-item">
          <div class="prog-label">Linux <span class="pull-right">44%</span></div>
          <div class="bar"><div class="fill bg-orange" style="width: 44%"></div></div>
        </div>
        <div class="prog-item">
          <div class="prog-label">iPhone <span class="pull-right">67%</span></div>
          <div class="bar"><div class="fill bg-red" style="width: 67%"></div></div>
        </div>
      </div>
    </div>

    <div class="card chart-card">
      <div class="card-header">Profit Chart</div>
      <div class="card-body chart-svg-container">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" class="main-svg-chart">
          <path d="M0,250 L125,50 L250,150 L375,220 L500,100 L625,210 L750,50 L875,150 L1000,180 V300 H0 Z" fill="rgba(26,188,156,0.3)" />
          <path d="M0,200 L125,280 L250,130 L375,280 L500,180 L625,250 L750,280 L875,130 L1000,180 V300 H0 Z" fill="rgba(26,188,156,0.6)" />
        </svg>
      </div>
    </div>

    <div class="card table-card">
      <div class="card-header">DataTables</div>
      <div class="card-body">
        <div class="table-top-controls">
          <div class="show-entries">
            Show 
            <select v-model="perPage" @change="currentPage = 1">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            entries
          </div>
          <div class="search-box">
            Search: <input v-model="searchQuery" @input="currentPage = 1" />
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rendering engine</th>
                <th>Browser</th>
                <th>Platform(s)</th>
                <th>Engine version</th>
                <th>CSS grade</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in paginatedData" :key="i">
                <td>{{ row.engine }}</td>
                <td>{{ row.browser }}</td>
                <td>{{ row.platform }}</td>
                <td>{{ row.version }}</td>
                <td>{{ row.grade }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer-info">
          <div class="info-text">
            Showing {{ startIdx }} to {{ endIdx }} of {{ filteredData.length }} entries
          </div>
          <div class="pagination">
            <button class="page-btn" @click="currentPage--" :disabled="currentPage === 1">‹</button>
            <button v-for="p in totalPages" :key="p" 
                    @click="currentPage = p" 
                    :class="['page-btn', { active: currentPage === p }]">
              {{ p }}
            </button>
            <button class="page-btn" @click="currentPage++" :disabled="currentPage === totalPages">›</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      currentPage: 1,
      perPage: 10, 
      fullData: [
        { engine: "Gecko", browser: "Firefox 1.0", platform: "Win 98+ / OSX.2+", version: "1.7", grade: "A" },
        { engine: "Gecko", browser: "Firefox 1.5", platform: "Win 98+ / OSX.2+", version: "1.8", grade: "A" },
        { engine: "Gecko", browser: "Firefox 2.0", platform: "Win 98+ / OSX.2+", version: "1.8", grade: "A" },
        { engine: "Gecko", browser: "Firefox 3.0", platform: "Win 2k+ / OSX.3+", version: "1.9", grade: "A" },
        { engine: "Gecko", browser: "Camino 1.0", platform: "OSX.2+", version: "1.8", grade: "A" },
        { engine: "Gecko", browser: "Camino 1.5", platform: "OSX.3+", version: "1.8", grade: "A" },
        { engine: "Gecko", browser: "Netscape 7.2", platform: "Win 95+ / Mac OS 8.6-9.2", version: "1.7", grade: "A" },
        { engine: "Gecko", browser: "Netscape Browser 8", platform: "Win 98SE+", version: "1.7", grade: "A" },
        { engine: "Gecko", browser: "Netscape Navigator 9", platform: "Win 98+ / OSX.2+", version: "1.8", grade: "A" },
        { engine: "Gecko", browser: "Mozilla 1.0", platform: "Win 95+ / OSX.1+", version: "1", grade: "A" },
        { engine: "Gecko", browser: "Mozilla 1.1", platform: "Win 95+ / OSX.1+", version: "1.1", grade: "A" },
        { engine: "Gecko", browser: "Mozilla 1.2", platform: "Win 95+ / OSX.1+", version: "1.2", grade: "A" },
        { engine: "KHTML", browser: "Konqueror 3.1", platform: "KDE 3.1", version: "3.1", grade: "C" },
        { engine: "KHTML", browser: "Konqueror 3.3", platform: "KDE 3.3", version: "3.3", grade: "A" },
        { engine: "KHTML", browser: "Konqueror 3.5", platform: "KDE 3.5", version: "3.5", grade: "A" },
        { engine: "Trident", browser: "Internet Explorer 4.0", platform: "Win 95+", version: "4", grade: "X" },
        { engine: "Trident", browser: "Internet Explorer 5.0", platform: "Win 95+", version: "5", grade: "C" },
        { engine: "Trident", browser: "Internet Explorer 5.5", platform: "Win 95+", version: "5.5", grade: "A" },
        { engine: "Trident", browser: "Internet Explorer 6", platform: "Win 98+", version: "6", grade: "A" },
        { engine: "Webkit", browser: "Safari 1.2", platform: "OSX.3", version: "125.5", grade: "A" },
        { engine: "Webkit", browser: "Safari 1.3", platform: "OSX.3", version: "312.8", grade: "A" },
        { engine: "Webkit", browser: "Safari 2.0", platform: "OSX.4+", version: "419.3", grade: "A" },
        { engine: "Misc", browser: "NetFront 3.1", platform: "Embedded devices", version: "-", grade: "C" },
        { engine: "Misc", browser: "NetFront 3.4", platform: "Embedded devices", version: "-", grade: "A" },
        { engine: "Misc", browser: "Dillo 0.8", platform: "Embedded devices", version: "-", grade: "X" }
        //data table
      ]
    }
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.fullData;
      const q = this.searchQuery.toLowerCase();
      return this.fullData.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      );
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.perPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredData.slice(start, start + this.perPage);
    },
    startIdx() { return (this.currentPage - 1) * this.perPage + 1; },
    endIdx() { 
      const end = this.currentPage * this.perPage;
      return end > this.filteredData.length ? this.filteredData.length : end;
    }
  }
}
</script>

<style scoped>
.admin-wrapper { padding:25px; background:#f1f2f7; font-family: 'Open Sans', sans-serif; }
.stats-row { display:flex; gap:20px; margin-bottom:25px; }
.stat-card { flex:1; background:white; padding:25px; text-align:center; border-radius: 4px; }
.icon-wrap i { font-size:35px; color: #58c9f3; margin-bottom: 10px; }
.stat-value { font-size:26px; font-weight:700; color: #39435c; }
.stat-label { font-size:12px; color:#c2c2c2; text-transform: uppercase; }

.middle-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; margin-bottom: 25px; }
.quick-menu-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.menu-item { background:white; padding:20px; text-align:center; border-radius: 4px; color: #58c9f3; }
.menu-item i { font-size: 24px; display: block; margin-bottom: 10px; }
.menu-item span { color: #797979; font-size: 13px; }

.progress-card { background: white; padding: 20px; border-radius: 4px; }
.prog-item { margin-bottom: 18px; }
.prog-label { font-size: 12px; font-weight: 600; color: #797979; }
.pull-right { float: right; font-weight: normal; color: #aaa; }
.bar { height:10px; background:#eff2f7; border-radius: 2px; margin-top:5px; }
.fill { height:100%; border-radius: 2px; }

.bg-blue{background:#58c9f3;}
.bg-green{background:#a9d86e;}
.bg-orange{background:#fcb322;}
.bg-red{background:#ff6c60;}

.card { background: white; border-radius: 4px; margin-bottom: 25px; box-shadow: 0 1px 1px rgba(0,0,0,0.05); }
.card-header { padding: 15px 20px; font-weight: 600; border-bottom: 1px solid #eff2f7; color: #39435c; }
.chart-svg-container { padding: 20px; height: 300px; }
.main-svg-chart { width: 100%; height: 100%; }

.table-top-controls { display: flex; justify-content: space-between; padding: 15px; font-size: 13px; }
.data-table { width:100%; border-collapse:collapse; }
.data-table th { background: #f9f9f9; text-align: left; padding: 12px; border-bottom: 2px solid #eff2f7; font-size: 13px; }
.data-table td { padding: 12px; border-bottom: 1px solid #eff2f7; font-size: 12px; color: #797979; }
.data-table tr:hover { background-color: #f5f5f5; }

.table-footer-info { display: flex; justify-content: space-between; padding: 15px; font-size: 13px; }
.page-btn { border: 1px solid #ddd; background: white; padding: 5px 10px; cursor: pointer; margin-left: 2px; }
.page-btn.active { background: #58c9f3; color: white; border-color: #58c9f3; }
.page-btn:disabled { cursor: not-allowed; opacity: 0.5; }
</style>