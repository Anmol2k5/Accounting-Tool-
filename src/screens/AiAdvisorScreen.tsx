import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useApp} from '../context/AppContext';
import {C, Spacing, FontSize, SharedStyles} from '../theme';
import {calculateMetrics} from '../utils/financial';
import {
  analyzeBasicQuestions,
  getSimulatedAiAnalysis,
  getFundingAnalysis,
  getGrowthAnalysis,
} from '../utils/advisor';
import type {ChatMessage} from '../types';

export function AiAdvisorScreen({navigation}: any) {
  const {transactions} = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '👋 Hello! I am your AI Business Advisor. I can analyze your accounts in real-time. Ask me anything, or use the quick actions below!',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollToEnd({animated: true}), 100);
    }
  }, [messages, isTyping]);

  if (transactions.length === 0) {
    return (
      <View style={[SharedStyles.screenContainer, SharedStyles.emptyState]}>
        <Text style={{fontSize: 48}}>🤖</Text>
        <Text style={SharedStyles.emptyStateText}>No Data Available</Text>
        <Text style={SharedStyles.emptyStateSubtext}>
          Add some transactions so the AI can analyze your numbers and provide
          recommendations.
        </Text>
        <TouchableOpacity
          style={SharedStyles.primaryButton}
          onPress={() => navigation.navigate('Add Transaction')}>
          <Text style={SharedStyles.primaryButtonText}>
            + Add Transaction
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const metrics = calculateMetrics(transactions);

  const processMessage = (text: string) => {
    const q = text.toLowerCase();
    const basicStats = analyzeBasicQuestions(metrics, transactions, text);

    let aiResponse: string;
    if (q.includes('health') || q.includes('analyze')) {
      aiResponse = getSimulatedAiAnalysis(metrics);
    } else if (q.includes('funding') || q.includes('options')) {
      aiResponse = getFundingAnalysis(metrics);
    } else if (q.includes('growth') || q.includes('opportunity')) {
      aiResponse = getGrowthAnalysis(metrics);
    } else {
      aiResponse = '';
    }

    let finalResponse = '';
    if (basicStats) {
      finalResponse = basicStats;
      if (aiResponse) {
        finalResponse += '\n\n━━━━━━━━━━━━━━━━━━━━\n\n🤖 AI Strategic Analysis:\n' + aiResponse;
      }
    } else if (aiResponse) {
      finalResponse = aiResponse;
    } else {
      finalResponse = `Here are your current core metrics:\n\n💰 Cash: ₹${metrics.cash.toFixed(2)}\n📊 Revenue: ₹${metrics.totalRevenue.toFixed(2)}\n📈 Net Income: ₹${metrics.netIncome.toFixed(2)}\n${
        Math.abs(metrics.totalAssets - (metrics.totalLiabilities + metrics.totalEquity)) < 0.01
          ? '✅ Equation Balanced'
          : '⚠️ Equation Mismatch'
      }\n\nTry asking about "financial health", "funding options", or "growth opportunities" for detailed analysis!`;
    }

    return finalResponse;
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) {return;}
    const text = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    setMessages(prev => [...prev, {role: 'user', content: text}]);

    // Simulate AI thinking
    setTimeout(() => {
      const response = processMessage(text);
      setMessages(prev => [...prev, {role: 'assistant', content: response}]);
      setIsTyping(false);
    }, 800);
  };

  const triggerQuickAction = (action: string) => {
    setMessages(prev => [...prev, {role: 'user', content: action}]);
    setIsTyping(true);

    setTimeout(() => {
      const response = processMessage(action);
      setMessages(prev => [...prev, {role: 'assistant', content: response}]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={SharedStyles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <View style={styles.headerDot} />
        <Text style={styles.headerTitle}>
          ✨ Financial Intelligence Engine
        </Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageArea}
        contentContainerStyle={{paddingVertical: Spacing.md}}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <View
              key={idx}
              style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowAi,
              ]}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: isUser ? C.textMuted : C.goldLight,
                  },
                ]}>
                <Text
                  style={[
                    styles.avatarText,
                    {color: isUser ? '#fff' : C.gold},
                  ]}>
                  {isUser ? 'U' : 'AI'}
                </Text>
              </View>
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleAi,
                ]}>
                <Text
                  style={[
                    styles.bubbleText,
                    isUser ? styles.bubbleTextUser : styles.bubbleTextAi,
                  ]}>
                  {msg.content}
                </Text>
              </View>
            </View>
          );
        })}

        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowAi]}>
            <View
              style={[styles.avatar, {backgroundColor: C.goldLight}]}>
              <Text style={[styles.avatarText, {color: C.gold}]}>AI</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleAi]}>
              <Text style={styles.typingDots}>● ● ●</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => triggerQuickAction('Analyze Financial Health')}>
            <Text style={styles.chipText}>📊 Health</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => triggerQuickAction('Funding Options')}>
            <Text style={styles.chipText}>💰 Funding</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => triggerQuickAction('Growth Opportunities')}>
            <Text style={styles.chipText}>📈 Growth</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => setInputValue('How is my cash position?')}>
            <Text style={styles.chipText}>💵 Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => setInputValue('What is my current ratio?')}>
            <Text style={styles.chipText}>📊 Ratio</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Input Area */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.chatInput}
          placeholder="Ask about your financials..."
          placeholderTextColor={C.textMuted}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          editable={!isTyping}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            {opacity: isTyping || !inputValue.trim() ? 0.4 : 1},
          ]}
          onPress={handleSend}
          disabled={isTyping || !inputValue.trim()}>
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ⓘ Simulated Financial AI Engine. Production API endpoints
          configurable.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.surface,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.success,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: C.textPrimary,
  },
  messageArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    padding: Spacing.md,
  },
  bubbleUser: {
    backgroundColor: C.surfaceElevated,
    borderTopRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: C.card,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  bubbleText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: C.textPrimary,
  },
  bubbleTextAi: {
    color: C.textSecondary,
  },
  typingDots: {
    color: C.gold,
    fontSize: FontSize.lg,
    letterSpacing: 2,
  },
  quickActions: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.surface,
  },
  chip: {
    backgroundColor: C.card,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: C.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: C.surface,
  },
  chatInput: {
    flex: 1,
    backgroundColor: C.inputBg,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: C.textPrimary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: C.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: C.surface,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: C.textMuted,
    textAlign: 'center',
  },
});
