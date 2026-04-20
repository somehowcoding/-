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
