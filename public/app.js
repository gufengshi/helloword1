/**
 * 前端脚本：定时从服务器获取最新时间，实现页面时间实时刷新。
 * 每 1 秒调用一次 /api/time 接口。
 */
(function () {
  const timeEl = document.getElementById('serverTime');
  if (!timeEl) return;

  async function refreshTime() {
    try {
      const res = await fetch('/api/time');
      if (!res.ok) return;
      const data = await res.json();
      timeEl.textContent = data.serverTime;
    } catch (err) {
      // 网络异常时保留当前显示，不做处理
    }
  }

  // 启动后立即刷新一次，然后每 1 秒刷新
  refreshTime();
  setInterval(refreshTime, 1000);
})();
