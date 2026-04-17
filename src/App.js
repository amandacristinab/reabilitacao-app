import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  PlayCircle,
  Hand,
  Camera,
  RefreshCw,
  Home,
  BarChart2,
  User,
  Dumbbell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserPlus,
  PartyPopper,
  LogOut,
  AlertTriangle
} from 'lucide-react';

/** Definições de Tema */
const theme = {
  colors: {
    background: '#0f172a',
    card: '#ffffff',
    primary: '#2dd4bf',
    primaryDark: '#26b3a1',
    secondary: '#1e293b',
    textDark: '#1e293b',
    textLight: '#94a3b8',
    border: '#e2e8f0',
    error: '#ef4444',
    success: '#10b981'
  }
};

const styles = {
  phone: {
    width: '375px',
    height: '812px',
    backgroundColor: '#ffffff',
    borderRadius: '44px',
    border: '10px solid #1e293b',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  notch: {
    width: '160px',
    height: '30px',
    backgroundColor: '#1e293b',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '0 0 18px 18px',
    zIndex: 100
  },
  homeIndicator: {
    width: '130px',
    height: '5px',
    backgroundColor: '#000',
    opacity: 0.1,
    position: 'absolute',
    bottom: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '10px',
    zIndex: 2000
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    color: '#1e293b',
    border: 'none',
    padding: '16px',
    borderRadius: '16px',
    fontWeight: '800',
    fontSize: '15px',
    cursor: 'pointer',
    width: '100%',
    letterSpacing: '0.3px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s ease'
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    color: '#94a3b8',
    cursor: 'not-allowed'
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    color: '#1e293b',
    border: `2px solid ${theme.colors.primary}`,
    padding: '16px',
    borderRadius: '16px',
    fontWeight: '800',
    fontSize: '15px',
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    border: `1px solid ${theme.colors.border}`,
    fontSize: '15px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: theme.colors.textDark
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: theme.colors.textLight,
    marginBottom: '6px',
    display: 'block',
    paddingLeft: '4px'
  }
};

const logoUrl = "https://drive.google.com/uc?export=view&id=1HCfap53kcM3JASSsRK79r9toJ4JGPfGM";

/** COMPONENTES COMPARTILHADOS */

const BackButton = ({ onBack, dark = false }) => (
  <button 
    style={{ 
      position: 'absolute', 
      top: 50, 
      left: 20, 
      background: 'none',
      border: 'none',
      cursor: 'pointer', 
      zIndex: 200,
      padding: '8px',
      borderRadius: '50%',
      backgroundColor: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    onClick={onBack}
  >
    <ChevronLeft size={24} color={dark ? '#fff' : theme.colors.textDark} strokeWidth={3} />
  </button>
);

const BottomNav = ({ activeTab, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'INÍCIO', icon: Home },
    { id: 'exercicios', label: 'TREINO', icon: Dumbbell },
    { id: 'progresso', label: 'PROGRESSO', icon: BarChart2 },
    { id: 'perfil', label: 'PERFIL', icon: User },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: '90px',
      backgroundColor: '#ffffff', borderTop: `1px solid ${theme.colors.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      paddingTop: '12px', zIndex: 1000, boxSizing: 'border-box'
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <div key={item.id} onClick={() => onNavigate(item.id)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isActive ? theme.colors.primary : theme.colors.textLight, cursor: 'pointer', flex: 1 }}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: '10px', marginTop: '5px', fontWeight: isActive ? '800' : '600' }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

/** TELA: BOAS-VINDAS */
const WelcomeScreen = ({ onNext }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <img src={logoUrl} alt="Logo" style={{ height: '44px' }} />
        <span style={{ fontWeight: '900', fontSize: '26px', color: theme.colors.textDark, letterSpacing: '-0.5px' }}>neuroviva</span>
      </div>
      <div style={{ width: '100%', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#f0fdfa', borderRadius: '32px', padding: '20px' }}>
           <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5bpVu0P-zdb9nFtmv5tLWHmCzbJiM8wox_3kRw7JzHw&s&ec=121585071" alt="Hero" style={{ width: '100%', borderRadius: '20px' }} />
        </div>
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: '900', color: theme.colors.textDark, marginBottom: '12px' }}>Bem-vindo!</h1>
      <p style={{ color: theme.colors.textLight, lineHeight: '1.5', marginBottom: '40px', padding: '0 20px' }}>Inicie a sua jornada de reabilitação com tecnologia e cuidado.</p>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button style={styles.buttonPrimary} onClick={() => onNext('register')}>CRIAR MINHA CONTA</button>
        <button style={styles.buttonOutline} onClick={() => onNext('login')}>ENTRAR</button>
      </div>
    </div>
  </div>
);

/** TELA: CADASTRO */
const RegisterScreen = ({ onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    nome: '', email: '', altura: '', peso: '', dataNasc: '', sexo: '', lesao: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
      <BackButton onBack={onBack} />
      <div style={{ marginTop: '70px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '900', color: theme.colors.textDark, margin: '0 0 8px 0' }}>Cadastro</h2>
        <p style={{ color: theme.colors.textLight, margin: 0 }}>Conte-nos um pouco sobre si.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={styles.label}>NOME COMPLETO</label>
        <input name="nome" placeholder="O seu nome" style={styles.input} value={formData.nome} onChange={handleChange} />
        
        <label style={styles.label}>E-MAIL</label>
        <input name="email" type="email" placeholder="seu@email.com" style={styles.input} value={formData.email} onChange={handleChange} />

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>ALTURA (cm)</label>
            <input name="altura" type="number" placeholder="Ex: 175" style={styles.input} value={formData.altura} onChange={handleChange} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>PESO (kg)</label>
            <input name="peso" type="number" placeholder="Ex: 70" style={styles.input} value={formData.peso} onChange={handleChange} />
          </div>
        </div>

        <label style={styles.label}>DATA DE NASCIMENTO</label>
        <input name="dataNasc" type="date" style={styles.input} value={formData.dataNasc} onChange={handleChange} />

        <label style={styles.label}>SEXO</label>
        <select name="sexo" style={styles.input} value={formData.sexo} onChange={handleChange}>
          <option value="">Selecione...</option>
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
          <option value="outro">Outro</option>
        </select>

        <label style={styles.label}>NOME DA LESÃO / CONDIÇÃO</label>
        <input name="lesao" placeholder="Ex: Lesão Medular T12" style={styles.input} value={formData.lesao} onChange={handleChange} />

        <button 
          style={{ ...styles.buttonPrimary, marginTop: '20px', marginBottom: '40px' }} 
          onClick={() => onRegister(formData.nome || 'UTILIZADOR')}
        >
          FINALIZAR CADASTRO
        </button>
      </div>
    </div>
  );
};

/** TELA: SUCESSO NO CADASTRO */
const SuccessScreen = ({ onContinue, onBack }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
    <BackButton onBack={onBack} />
    <div style={{ 
      width: '100px', 
      height: '100px', 
      backgroundColor: '#f0fdfa', 
      borderRadius: '50%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      marginBottom: '32px',
      color: theme.colors.primary
    }}>
      <PartyPopper size={50} />
    </div>
    
    <h2 style={{ fontSize: '28px', fontWeight: '900', color: theme.colors.textDark, marginBottom: '16px' }}>
      Parabéns!
    </h2>
    
    <p style={{ fontSize: '18px', fontWeight: '700', color: theme.colors.textDark, marginBottom: '8px' }}>
      Cadastro realizado com sucesso!
    </p>
    
    <p style={{ fontSize: '16px', color: theme.colors.textLight, marginBottom: '48px', lineHeight: '1.5' }}>
      Preparado? Vamos movimentar-nos?
    </p>

    <button style={styles.buttonPrimary} onClick={onContinue}>
      VAMOS COMEÇAR!
    </button>
  </div>
);

/** TELA: LOGIN */
const LoginScreen = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Verifica se ambos os campos estão preenchidos
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLoginClick = () => {
    if (isFormValid) {
      onLogin(email ? email.split('@')[0].toUpperCase() : 'UTILIZADOR');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <BackButton onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: theme.colors.textDark, marginBottom: '8px' }}>Login</h2>
        <p style={{ color: theme.colors.textLight, marginBottom: '32px' }}>Acesse sua conta para se movimentar.</p>
        
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={styles.input} 
        />
        
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={styles.input} 
        />
        
        <button 
          style={{ 
            ...styles.buttonPrimary, 
            ...(!isFormValid ? styles.buttonDisabled : {}) 
          }} 
          onClick={handleLoginClick}
          disabled={!isFormValid}
        >
          ENTRAR
        </button>
      </div>
    </div>
  );
};

/** TELA: DASHBOARD */
const DashboardScreen = ({ userName, userPhoto, onPhotoChange, onNavigate, onBack }) => {
  const fileInputRef = useRef(null);
  const dias = [
    { d: 'D', done: true, color: '#f43f5e' }, { d: 'S', done: true, color: '#f59e0b' },
    { d: 'T', done: true, color: '#3b82f6' }, { d: 'Q', done: false, color: '#e2e8f0' },
    { d: 'Q', done: false, color: '#e2e8f0' }, { d: 'S', done: false, color: '#e2e8f0' },
    { d: 'S', done: false, color: '#e2e8f0' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', backgroundColor: '#f8fafc' }}>
      <BackButton onBack={onBack} />
      <header style={{ marginTop: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: theme.colors.textDark, margin: 0 }}>Olá, {userName}!</h2>
          <p style={{ fontSize: '15px', color: theme.colors.textLight, marginTop: '4px' }}>Vamos começar?</p>
        </div>
        <div onClick={() => fileInputRef.current.click()}
          style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: `2px solid ${theme.colors.primary}`, overflow: 'hidden', cursor: 'pointer' }}>
          {userPhoto ? <img src={userPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Perfil" /> : <User size={28} color={theme.colors.primary} />}
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            if(file) {
              const reader = new FileReader();
              reader.onloadend = () => onPhotoChange(reader.result);
              reader.readAsDataURL(file);
            }
          }} />
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div onClick={() => onNavigate('exercicios')}
          style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`, borderRadius: '24px', padding: '24px', color: theme.colors.secondary, boxShadow: '0 10px 25px rgba(45, 212, 191, 0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', padding: '12px', borderRadius: '16px' }}>
            <Dumbbell size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>Treino do Dia</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600', opacity: 0.8 }}>Duração: 15 min</p>
          </div>
          <ChevronRight size={24} style={{ marginLeft: 'auto' }} />
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '800', color: theme.colors.textDark, textAlign: 'center' }}>FREQUÊNCIA</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            {dias.map((dia, i) => (
              <div key={i} style={{ width: '34px', height: '34px', borderRadius: '12px', backgroundColor: dia.done ? dia.color : '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: dia.done ? '#fff' : theme.colors.textLight, fontSize: '13px', fontWeight: '800' }}>
                {dia.done ? <CheckCircle2 size={18} /> : dia.d}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: theme.colors.textDark }}>
              <ShieldCheck size={18} color="#10b981" />
              <span>Órtese: <strong style={{ fontWeight: '800' }}>OK</strong></span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav activeTab="dashboard" onNavigate={onNavigate} />
    </div>
  );
};

/** TELA: LISTA DE EXERCÍCIOS */
const ExerciseListScreen = ({ onSelect, onNavigate, onBack }) => {
  const exercises = [
    { id: 1, name: "Alongamento de Bíceps", dur: "30s", reps: "2 séries", icon: "💪" },
    { id: 2, name: "Extensão de Pulso", dur: "30s", reps: "3 séries", icon: "✋" },
    { id: 3, name: "Rotação de Ombro", dur: "45s", reps: "2 séries", icon: "🔄" },
  ];

  return (
    <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '24px' }}>
      <BackButton onBack={onBack} />
      <header style={{ marginTop: '90px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: theme.colors.textDark, margin: 0 }}>Exercícios</h2>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {exercises.map(ex => (
          <div key={ex.id} onClick={() => onSelect(ex)}
            style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
            <div style={{ fontSize: '24px', backgroundColor: '#f0fdfa', padding: '12px', borderRadius: '16px' }}>{ex.icon}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: theme.colors.textDark }}>{ex.name}</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: theme.colors.textLight }}>{ex.reps} • {ex.dur}</p>
            </div>
            <PlayCircle size={24} color={theme.colors.primary} strokeWidth={2.5} />
          </div>
        ))}
      </div>
      <BottomNav activeTab="exercicios" onNavigate={onNavigate} />
    </div>
  );
};

/** TELA: PLAYER */
const ExercisePlayerScreen = ({ exercise, onBack }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0) setIsRunning(false);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCamOn(false);
  };

  const toggleCamera = async () => {
    if (camOn) {
      stopCamera();
    } else {
      setErrorMsg('');
      try {
        const constraints = { video: true, audio: false };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setCamOn(true);

        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().catch(e => console.error("Play failed", e));
            };
          }
        }, 150);

      } catch (err) {
        console.error("Camera Error:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMsg("Permissão bloqueada. Clique no cadeado na barra de endereços e permita a câmara.");
        } else {
          setErrorMsg("Erro ao aceder à câmara. Verifique se o dispositivo está ligado e acessível.");
        }
      }
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1e293b' }}>
      <div style={{ padding: '50px 24px 20px', display: 'flex', alignItems: 'center', color: '#fff' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><ChevronLeft size={28} /></button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: '800', fontSize: '18px' }}>{exercise.name}</span>
      </div>
      
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
        {camOn ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', backgroundColor: '#000' }} 
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', padding: '30px', textAlign: 'center' }}>
            {errorMsg ? (
              <>
                <AlertTriangle size={48} color={theme.colors.error} style={{ marginBottom: '16px' }} />
                <p style={{ fontSize: '14px', marginBottom: '20px', opacity: 0.9 }}>{errorMsg}</p>
                <button onClick={() => window.location.reload()} style={{ backgroundColor: theme.colors.primary, border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', color: theme.colors.secondary, cursor: 'pointer' }}>
                  RECARREGAR
                </button>
              </>
            ) : (
              <>
                <Hand size={60} strokeWidth={1} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ opacity: 0.6 }}>Ative a câmara para monitorizar o treino</p>
              </>
            )}
          </div>
        )}
        
        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255,255,255,0.95)', padding: '10px 40px', borderRadius: '40px', border: `3px solid ${theme.colors.primary}`, zIndex: 10 }}>
          <span style={{ fontSize: '32px', fontWeight: '900', color: theme.colors.secondary }}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '32px 24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={toggleCamera} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', backgroundColor: camOn ? theme.colors.error : '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Camera size={24} color={camOn ? '#fff' : theme.colors.secondary} />
        </button>
        
        <button onClick={() => setIsRunning(!isRunning)} style={{ flex: 1, margin: '0 20px', height: '60px', borderRadius: '20px', border: 'none', backgroundColor: theme.colors.primary, color: theme.colors.secondary, fontSize: '16px', fontWeight: '900', cursor: 'pointer' }}>
          {isRunning ? 'PAUSAR' : 'INICIAR'}
        </button>
        
        <button onClick={() => { setTimeLeft(30); setIsRunning(false); }} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={24} color={theme.colors.secondary} />
        </button>
      </div>
    </div>
  );
};

/** TELA: PERFIL */
const ProfileScreen = ({ userName, onBack, onNavigate }) => (
  <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '24px' }}>
    <BackButton onBack={onBack} />
    <div style={{ marginTop: '90px', textAlign: 'center' }}>
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: theme.colors.primary, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <User size={50} />
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: '900', color: theme.colors.textDark }}>{userName}</h2>
      <p style={{ color: theme.colors.textLight }}>Utilizador Neuroviva</p>
    </div>
    
    <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <button style={{ ...styles.buttonOutline, justifyContent: 'flex-start', padding: '20px', gap: '15px', border: 'none', backgroundColor: '#fff' }}>
        <ShieldCheck size={20} color={theme.colors.primary} /> Configurações de Saúde
      </button>
      <button style={{ ...styles.buttonOutline, justifyContent: 'flex-start', padding: '20px', gap: '15px', border: 'none', backgroundColor: '#fff' }} onClick={() => onNavigate('welcome')}>
        <LogOut size={20} color={theme.colors.error} /> Sair da Conta
      </button>
    </div>
    <BottomNav activeTab="perfil" onNavigate={onNavigate} />
  </div>
);

/** APLICATIVO PRINCIPAL */
export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [history, setHistory] = useState(['welcome']);
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [selectedEx, setSelectedEx] = useState(null);

  const navigate = (nextScreen) => {
    if (nextScreen === screen) return;
    setHistory(prev => [...prev, nextScreen]);
    setScreen(nextScreen);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setScreen(newHistory[newHistory.length - 1]);
    } else {
      setScreen('welcome');
      setHistory(['welcome']);
    }
  };

  const handleRegisterSuccess = (name) => {
    setUserName(name.toUpperCase());
    navigate('success');
  };

  const handleAuth = (name) => {
    setUserName(name.toUpperCase());
    navigate('dashboard');
  };

  const renderContent = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen onNext={navigate} />;
      case 'register': return <RegisterScreen onRegister={handleRegisterSuccess} onBack={goBack} />;
      case 'success': return <SuccessScreen onContinue={() => navigate('dashboard')} onBack={goBack} />;
      case 'login': return <LoginScreen onLogin={handleAuth} onBack={goBack} />;
      case 'dashboard': return <DashboardScreen userName={userName} userPhoto={userPhoto} onPhotoChange={setUserPhoto} onNavigate={navigate} onBack={goBack} />;
      case 'exercicios': return <ExerciseListScreen onSelect={(ex) => { setSelectedEx(ex); navigate('player'); }} onNavigate={navigate} onBack={goBack} />;
      case 'player': return <ExercisePlayerScreen exercise={selectedEx} onBack={goBack} />;
      case 'perfil': return <ProfileScreen userName={userName} onBack={goBack} onNavigate={navigate} />;
      default: return <WelcomeScreen onNext={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={styles.phone}>
        <div style={styles.notch} />
        {renderContent()}
        <div style={styles.homeIndicator} />
      </div>
    </div>
  );
}