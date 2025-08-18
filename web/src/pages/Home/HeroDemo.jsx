import React, { useEffect, useRef, useState } from 'react';

const SCENE_MS = 3000; // 每个场景时长

const chatScript = [
  { role: 'user', text: '能把这段会议纪要压缩成 .specs 吗？' },
  { role: 'ai', text: '已解析关键目标与约束，准备建模…' },
  { role: 'user', text: '记得列出测试用例与输入边界。' },
  { role: 'ai', text: '收到，正在补充…' },
  { role: 'ai', text: '生成完成，可导出或发布到广场。' }
];

const codeSample = [
  '// AnySpecs demo',
  'function compress(input) {',
  '  const goals = parseGoals(input)',
  '  const constraints = parseConstraints(input)',
  "  return { type: '.specs', goals, constraints }",
  '}',
  '',
  'const result = compress(meetingNotes)',
  'console.log(result)'
].join('\n');

export default function HeroDemo() {
  const [scene, setScene] = useState('chat'); // chat | progress | code
  const [shownMsgs, setShownMsgs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState('');

  const timersRef = useRef([]);
  const chatListRef = useRef(null);

  function clearTimers() {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }

  useEffect(() => {
    // 初始启动
    setScene('chat');
    return () => clearTimers();
  }, []);

  useEffect(() => {
    clearTimers();
    if (scene === 'chat') {
      // 重置并按时间片逐条追加
      setShownMsgs([]);
      const step = Math.max(1, Math.floor(SCENE_MS / chatScript.length));
      chatScript.forEach((m, i) => {
        const t = setTimeout(() => {
          setShownMsgs(prev => {
            const next = [...prev, m];
            // 自动滚动到底部
            requestAnimationFrame(() => {
              if (chatListRef.current) {
                chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
              }
            });
            return next;
          });
        }, i * step + 80);
        timersRef.current.push(t);
      });
      timersRef.current.push(setTimeout(() => setScene('progress'), SCENE_MS + 120));
    }

    if (scene === 'progress') {
      // 触发 0 -> 100 的过渡
      setProgress(0);
      requestAnimationFrame(() => setProgress(100));
      timersRef.current.push(setTimeout(() => setScene('code'), SCENE_MS + 80));
    }

    if (scene === 'code') {
      // 简易“打字机”效果
      setTyped('');
      const total = codeSample.length;
      const ticks = 60;
      const slice = Math.max(1, Math.ceil(total / ticks));
      let i = 0;

      function tick() {
        i = Math.min(total, i + slice);
        setTyped(codeSample.slice(0, i));
        if (i < total) {
          timersRef.current.push(setTimeout(tick, SCENE_MS / ticks));
        }
      }
      tick();
      timersRef.current.push(setTimeout(() => setScene('chat'), SCENE_MS + 120));
    }

    return () => clearTimers();
  }, [scene]);

  return (
    <div className="demo-canvas">
      {/* 场景 A：聊天 */}
      <div className={`scene ${scene === 'chat' ? 'active' : ''}`}>
        <div ref={chatListRef} className="hero-chat-list">
          {shownMsgs.map((m, idx) => (
            <div key={idx} className="msg-reveal">
              <div className={`hero-bubble ${m.role}`}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 场景 B：进度条 */}
      <div className={`scene ${scene === 'progress' ? 'active' : ''}`}>
        <div className="progress-skeleton">
          <div className="sk-row" />
          <div className="sk-row sk-row-short" />
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 场景 C：代码 */}
      <div className={`scene ${scene === 'code' ? 'active' : ''}`}>
        <pre className="code-pre">{typed}</pre>
      </div>
    </div>
  );
}


