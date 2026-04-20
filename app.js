// [DB] 탈퇴 유저 데이터 (유저님이 직접 추가하는 장부입니다)
const DELETED_DB = {
    "jangye": 2500,
    "entry_dev": 5000
};

async function searchUser() {
    const input = document.getElementById('userInput').value.trim();
    const resultArea = document.getElementById('resultArea');
    if (!input) return;

    // 로딩 표시
    resultArea.innerHTML = `<p class="text-center animate-pulse text-slate-400 font-bold">데이터 분석 중...</p>`;
    resultArea.classList.remove('hidden', 'fade-out');

    try {
        // 1. 닉네임으로 검색해서 ID(username) 찾기
        const searchRes = await fetch(`https://playentry.org/api/v2/search/user?text=${encodeURIComponent(input)}`);
        const searchData = await searchRes.json();
        <!DOCTYPE html>
<html lang="ko" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ENTRY HISTORY</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { darkMode: 'class' }</script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@600;900&display=swap');
        body { font-family: 'Pretendard', sans-serif; transition: 0.3s; }
        .loading-spin { border: 4px solid rgba(59, 130, 246, 0.2); border-top: 4px solid #3b82f6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body class="bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 text-center">

    <div class="mb-10">
        <h1 class="text-5xl font-black tracking-tighter mb-2 italic text-blue-600">ENTRY HISTORY</h1>
        <p class="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Real-time Scanner Bot</p>
    </div>

    <div class="w-full max-w-md flex gap-2 mb-8">
        <input id="userInput" type="text" onkeyup="if(window.event.keyCode==13){startScan()}"
               placeholder="닉네임 또는 ID" 
               class="flex-grow p-5 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl outline-none focus:ring-2 ring-blue-500 font-bold text-black dark:text-white">
        <button onclick="startScan()" class="bg-blue-600 text-white px-8 py-5 rounded-3xl font-black shadow-lg active:scale-95 transition-all">
            스캔
        </button>
    </div>

    <div id="resultArea" class="hidden w-full max-w-md"></div>

    <footer class="mt-20 text-slate-400 dark:text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">
        Made by 어쩌다코딩
    </footer>

    <script>
        async function startScan() {
            const input = document.getElementById('userInput').value.trim();
            const resultArea = document.getElementById('resultArea');
            if (!input) return alert("아이디를 입력해주세요!");

            // 1. 로딩 표시 시작
            resultArea.classList.remove('hidden');
            resultArea.innerHTML = `
                <div class="p-10 bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl flex flex-col items-center">
                    <div class="loading-spin mb-4"></div>
                    <p class="text-blue-500 font-black animate-pulse">엔트리 서버 연결 중...</p>
                    <p id="statusLog" class="text-[10px] text-slate-500 mt-2 font-mono">준비 중...</p>
                </div>`;

            try {
                const statusLog = document.getElementById('statusLog');
                
                // 2. 유저 검색
                statusLog.innerText = "유저 정보를 찾는 중...";
                const searchRes = await fetch(`https://playentry.org/api/v2/search/user?text=${encodeURIComponent(input)}`);
                const searchData = await searchRes.json();
                const target = (searchData.data && searchData.data.length > 0) ? searchData.data[0] : null;
                
                if (!target) throw new Error("유저를 찾을 수 없습니다.");
                const targetId = target.username;

                // 3. 스캔 시작
                let allFollowers = [];
                statusLog.innerText = "명단 전수조사 시작 (더보기 클릭 중...)";

                // 안전하게 5페이지까지만 먼저 테스트
                for (let page = 1; page <= 5; page++) {
                    statusLog.innerText = `데이터 수집 중: ${page}페이지...`;
                    const fRes = await fetch(`https://playentry.org/api/user/followers/${targetId}?page=${page}`);
                    const fData = await fRes.json();
                    
                    if (fData && fData.length > 0) {
                        allFollowers = [...allFollowers, ...fData];
                    } else {
                        break; 
                    }
                    await new Promise(r => setTimeout(r, 100)); // 지연 시간
                }

                // 4. 결과 출력
                resultArea.innerHTML = `
                    <div class="bg-white dark:bg-zinc-900 rounded-[45px] p-10 shadow-2xl border-4 border-blue-600/20">
                        <h2 class="text-2xl font-black mb-1">${target.nickname}</h2>
                        <p class="text-blue-500 text-[10px] font-bold mb-6 uppercase">@${targetId}</p>
                        
                        <div class="space-y-3 mb-8">
                            <div class="flex justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                <span class="text-slate-400 font-bold text-xs uppercase">Official</span>
                                <span class="font-black text-lg">${target.followerCount.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between p-4 bg-blue-500/10 rounded-2xl">
                                <span class="text-blue-500 font-bold text-xs uppercase">Scanned</span>
                                <span class="font-black text-lg text-blue-600">${allFollowers.length.toLocaleString()}</span>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-400 font-bold">Verified By 어쩌다코딩 Scanner</p>
                    </div>`;

            } catch (e) {
                console.error(e);
                resultArea.innerHTML = `<div class="p-8 bg-red-500/10 text-red-500 rounded-3xl font-black">에러: ${e.message}</div>`;
            }
        }
    </script>
</body>
</html>
        // 검색 결과가 있으면 첫 번째 사람의 ID 사용, 없으면 입력값 그대로 사용
        const targetId = (searchData.data && searchData.data.length > 0) ? searchData.data[0].username : input;

        // 2. 해당 ID의 실제 프로필 정보 가져오기
        const res = await fetch(`https://playentry.org/api/user/profile/${targetId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        // 3. 점수 계산 (현재 팔로워 + 장부에 적힌 탈퇴 데이터)
        const current = data.followerCount || 0;
        const deleted = DELETED_DB[targetId] || 0;

        // 4. 결과 화면 꾸미기
        resultArea.innerHTML = `
            <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] p-8 shadow-sm animate-in zoom-in duration-300">
                <div class="flex items-center gap-4 mb-8">
                    <img src="${data.image?.status === 'custom' ? 'https://playentry.org/uploads/profile/' + targetId.slice(0,2) + '/' + targetId.slice(2,4) + '/avatar/' + targetId + '.png' : 'https://playentry.org/img/DefaultAvatar.png'}" 
                         class="w-16 h-16 rounded-full border border-slate-200 dark:border-white/10 object-cover">
                    <div>
                        <h2 class="text-xl font-bold">${data.nickname}</h2>
                        <p class="text-slate-400 text-xs font-medium">@${targetId}</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between text-sm font-medium">
                        <span class="text-slate-500">현재 팔로워</span>
                        <span>${current.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between text-sm font-medium">
                        <span class="text-slate-500 font-bold text-blue-500 uppercase tracking-tighter">Archived Data</span>
                        <span class="text-blue-500 font-bold">+${deleted.toLocaleString()}</span>
                    </div>
                    <div class="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-end">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Influence</span>
                        <span class="text-4xl font-black italic tracking-tighter">${(current + deleted).toLocaleString()}</span>
                    </div>
                </div>
            </div>`;
    } catch (e) {
        // 유저를 못 찾았을 때 에러 메시지
        resultArea.innerHTML = `<div class="bg-red-500/10 text-red-500 p-6 rounded-2xl text-center font-bold italic">User Not Found!</div>`;
        setTimeout(() => {
            resultArea.classList.add('fade-out');
            setTimeout(() => resultArea.classList.add('hidden'), 600);
        }, 2000);
    }
}
