import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        welcome: 'Welcome',
        admin: 'Admin',
        help: 'Help',
        logout: 'Logout',
        cancel: 'Cancel',
        confirm: 'Confirm',
        startDate: 'Start Date',
        endDate: 'End Date',
        saveChanges: 'Save Changes'
      },
      admin: {
        dashboard: 'Admin Dashboard',
        AddVotingTopic: 'Add Voting Topic',
        endVoting: 'End Voting Session',
        restartVoting: 'Restart Voting',
        overview: 'Overview',
        settings: 'Settings',
        audit: 'Audit Log',
        reports: 'Reports',
        liveResults: 'Live Results',
        votingRules: 'Voting Rules'
      },
      candidates: {
        total: 'Total Candidates',
        manage: 'Manage Candidates',
        addcandidate: 'Add Candidate',
        managecandidates: 'Manage Candidates for',
        cancel: 'Cancel',
        cName: 'Candidate Name',
        cPosition: 'Position',
        cDescription: 'Description',
        ImageURL: 'Image URL',
      },
      voting: {
        VotingTopics: 'Voting Topics',
        TopicName: 'Topic Name',
        Description: 'Description',
        addtopic: 'Add Topic',
        CurrentVotes: 'Current Votes',
        RemoveTopic: 'Remove Topic',
        totalVotes: 'Total Votes',
        totalTopics: 'Total Topics',
        activeTopics: 'Active Topics',
        VotingReport: 'Voting Report',
        ExportCSV: 'Export CSV',
        VoteDistribution: 'Vote Distribution',
        SummaryStatistics: 'Summary Statistics',
        TotalVotesCast: 'Total Votes Cast',
        LeadingCandidates: 'Leading Candidates',
        AverageVotesperCandidate: 'Average Votes per Candidate',
        progress: 'Voting Progress',
        votes: 'votes',
        selectionType: 'Selection Type',
        singleChoice: 'Single Choice',
        multipleChoice: 'Multiple Choice',
        rankedChoice: 'Ranked Choice',
        maxSelections: 'Maximum Selections',
        votingPeriod: 'Voting Period',
        requireVerification: 'Require Voter Verification',
        showResultsLive: 'Show Results Live'
      }
    }
  },
  es: {
    translation: {
      common: {
        welcome: 'Bienvenido',
        admin: 'Administrador',
        help: 'Ayuda',
        logout: 'Cerrar sesión',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        startDate: 'Fecha de inicio',
        endDate: 'Fecha de fin',
        saveChanges: 'Guardar cambios'
      },
      admin: {
        dashboard: 'Panel de administración',
        AddVotingTopic: 'Agregar tema de votación',
        endVoting: 'Finalizar votación',
        restartVoting: 'Reiniciar votación',
        overview: 'Resumen',
        settings: 'Configuración',
        audit: 'Registro de auditoría',
        reports: 'Informes',
        liveResults: 'Resultados en vivo',
        votingRules: 'Reglas de votación'
      },
      candidates: {
        total: 'Total de candidatos',
        manage: 'Gestionar candidatos',
        addcandidate: 'Agregar candidatos',
        managecandidates: 'Administrar candidatas para',
        cancel: 'Cancelar',
        cName: 'Nombre del candidato',
        cPosition: 'Posición',
        cDescription: 'Descripción',
        ImageURL: 'URL de la imagen',
      },
      voting: {
        VotingTopics: 'Temas de votación',
        TopicName: 'Nombre del tema',
        Description: 'Descripción',
        addtopic: 'Agregar tema',
        CurrentVotes: 'Votos actuales',
        totalVotes: 'Votos totales',
        totalTopics: 'Número total de temas',
        activeTopics: 'Temas activos',
        VotingReport: 'Informe de votación',
        ExportCSV: 'Exportar CSV',
        VoteDistribution: 'Distribución de votos',
        SummaryStatistics: 'Estadísticas resumidas',
        TotalVotesCast: 'Total de votos emitidos',
        LeadingCandidates: 'Candidatos principales',
        AverageVotesperCandidate: 'Promedio de votos por candidato',
        RemoveTopic: 'Eliminar tema',
        progress: 'Progreso de votación',
        votes: 'votos',
        selectionType: 'Tipo de selección',
        singleChoice: 'Selección única',
        multipleChoice: 'Selección múltiple',
        rankedChoice: 'Selección ordenada',
        maxSelections: 'Selecciones máximas',
        votingPeriod: 'Período de votación',
        requireVerification: 'Requerir verificación de votante',
        showResultsLive: 'Mostrar resultados en vivo'
      }
    }
  },
  zh: {
    translation: {
      common: {
        welcome: '欢迎',
        admin: '管理员',
        help: '帮助',
        logout: '退出',
        cancel: '取消',
        confirm: '确认',
        startDate: '开始日期',
        endDate: '结束日期',
        saveChanges: '保存更改'
      },
      admin: {
        dashboard: '管理面板',
        AddVotingTopic: '新增投票主題',
        endVoting: '结束投票',
        restartVoting: '重新开始投票',
        overview: '概览',
        settings: '设置',
        audit: '审计日志',
        reports: '报告',
        liveResults: '实时结果',
        votingRules: '投票规则'
      },
      candidates: {
        total: '候选人总数',
        manage: '管理候选人',
        addcandidate: '添加候选人',
        managecandidates: '管理候选人在',
        cancel: '取消',
        cName: '候选人姓名',
        cPosition: '职位',
        cDescription: '描述',
        ImageURL: '图片链接',
      },
      voting: {
        VotingTopics: '投票主题',
        TopicName: '主题名称',
        Description: '描述',
        addtopic: '新增主题',
        CurrentVotes: '当前票数',
        totalVotes: '总票数',
        totalTopics: '主题总数',
        activeTopics: '活跃话题',
        VotingReport: '投票报告',
        ExportCSV: '导出 CSV',
        VoteDistribution: '投票分布',
        SummaryStatistics: '摘要统计',
        TotalVotesCast: '总投票数',
        LeadingCandidates:  '领先候选人',
        AverageVotesperCandidate: '每位候选人的平均票数',
        RemoveTopic: '移除主题',
        progress: '投票进度',
        votes: '票',
        selectionType: '选择类型',
        singleChoice: '单选',
        multipleChoice: '多选',
        rankedChoice: '排序选择',
        maxSelections: '最大选择数',
        votingPeriod: '投票期限',
        requireVerification: '需要选民验证',
        showResultsLive: '实时显示结果'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;