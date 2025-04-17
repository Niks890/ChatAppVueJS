<template>
    <VContainer fluid class="fill-height pa-0">
        <VRow no-gutters class="fill-height">
            <!-- Danh sách bạn bè -->
            <v-slide-x-transition>
                <VCol v-show="!isMobile || showUserList" cols="12" md="3" class="pa-4 user-list"
                    style="border-right: 1px solid #ddd; background-color: #f9f9f9;">
                    <div class="d-flex justify-space-between align-center mb-4" v-if="isMobile">
                        <strong>Danh sách</strong>
                        <VBtn icon @click="showUserList = false" variant="text">
                            <VIcon icon="mdi-close" />
                        </VBtn>
                    </div>

                    <VTextField v-model="search" density="comfortable" variant="outlined" placeholder="Tìm kiếm..."
                        prepend-inner-icon="mdi-magnify" class="mb-4 search-box" />

                    <VListItem v-for="(item, index) in users" :key="item.id" rounded class="mb-2 friend-item"
                        @click="selectUser(item.group_id, item.id, item.name)">
                        <template #prepend>
                            <VAvatar color="primary" size="40">
                                <span class="text-white">{{ item.name.charAt(0) }}</span>
                            </VAvatar>
                        </template>
                        <VListItemTitle class="font-weight-medium">{{ item.name }}</VListItemTitle>
                        <VListItemSubtitle v-show="!isMobile">Tin nhắn gần đây...</VListItemSubtitle>
                    </VListItem>
                </VCol>
            </v-slide-x-transition>

            <!-- Nội dung chat -->
            <VCol cols="12" md="9" class="d-flex flex-column chat-area">
                <!-- Header -->
                <div class="chat-header">
                    <div class="d-flex align-center gap-3">
                        <VBtn icon class="d-md-none" @click="showUserList = true" variant="text">
                            <VIcon icon="mdi-menu" />
                        </VBtn>
                        <VAvatar color="primary" size="40">
                            <span class="text-white">{{ selectedUserName.charAt(0) }}</span>
                        </VAvatar>
                        <div>
                            <h3 class="text-subtitle-1 font-weight-medium mb-0">{{ selectedUserName }}</h3>
                            <p class="text-caption text-grey">Đang hoạt động</p>
                        </div>
                    </div>
                    <VBtn icon variant="text" style="color: #7b7b7b;">
                        <VIcon icon="mdi-dots-vertical" />
                    </VBtn>
                </div>

                <!-- Tin nhắn -->
                <div class="chat-messages" ref="chatBoxRef">
                    <div v-for="(msg, index) in messages" :key="index" class="message-wrapper" :class="msg.type">
                        <span v-if="msg.type === 'received'" class="sender-name">{{ msg.senderName }}</span>
                        <div class="message-bubble">{{ msg.content }}</div>
                    </div>
                </div>

                <!-- Input -->
                <div class="chat-input-bar">
                    <VTextField ref="inputRef" v-model="message" density="comfortable" variant="outlined"
                        placeholder="Nhập tin nhắn..." class="flex-grow-1" hide-details style="border-radius: 30px;" />
                    <VBtn icon @click="sendMessage" color="primary" class="rounded-full">
                        <VIcon icon="mdi-send" />
                    </VBtn>
                    <VBtn icon class="rounded-full" color="grey">
                        <VIcon icon="mdi-paperclip" />
                    </VBtn>
                    <VBtn icon class="rounded-full" color="grey">
                        <VIcon icon="mdi-image" />
                    </VBtn>
                </div>
            </VCol>
        </VRow>
    </VContainer>
</template>


<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { userId } from '../../../composables/userAuth.js';
import api from '../../../configs/axios.js';

const users = ref([]);
const search = ref('');
const message = ref('');
const messages = ref([]);
const isMobile = ref(false);
const showUserList = ref(false);
const inputRef = ref(null);
const chatBoxRef = ref(null);
const selectedUserName = ref('');
const selectedGroupId = ref(null);

// Scroll xuống cuối khung chat
const scrollToBottom = () => {
    const el = chatBoxRef.value;
    if (el) el.scrollTop = el.scrollHeight;
};

// Watch khi có tin nhắn mới thì scroll xuống
watch(messages, async () => {
    await nextTick();
    scrollToBottom();
});



const sendMessage = async () => {
    if (!message.value.trim()) return;
    console.log(selectedGroupId.value, userId.value, message.value);

    const response = await api.post('/send-message', {
        message: message.value,
        group_id: selectedGroupId.value,
        user_id: userId.value
    });

    if (response.data.success) {
        messages.value.push({ content: message.value, type: 'sent' });
        message.value = '';
        nextTick(scrollToBottom);
    }
};


// Fetch danh sách user
const fetchUsers = async () => {
    try {
        const res = await api.get('/users');
        users.value = res.data.data.filter(user => user.id !== userId.value);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách user:', error);
    }
};

// Fetch lịch sử tin nhắn
const fetchMessages = async (groupId, otherUserId) => {
    try {
        const res = await api.post('/messages', {
            group_id: groupId,
            user_id: userId.value,
            other_user_id: otherUserId
        });

        messages.value = res.data.data.map(msg => ({
            content: msg.message,
            type: msg.sender_id === userId.value ? 'sent' : 'received',
            senderName: msg.sender.name,
            file: msg.file_path,
            createdAt: msg.created_at,
        }));
    } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error);
    }
};



const selectUser = async (groupId, otherUserId, name) => {
    try {
        const res = await api.post('/group-id', {
            other_user_id: otherUserId,
            user_id: userId.value
        });

        selectedGroupId.value = res.data.data; // Lưu group_id
        console.log('Group ID:', res.data.data);
        await fetchMessages(res.data.data, otherUserId);
        selectedUserName.value = name;
        showUserList.value = isMobile.value ? false : true;
    } catch (error) {
        console.error('Lỗi khi chọn người dùng:', error);
    }
};


// Kiểm tra thiết bị mobile
const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
    if (!isMobile.value) showUserList.value = true;
};

onMounted(() => {
    fetchUsers();
    checkMobile();
    window.addEventListener('resize', checkMobile);

    window.Echo.channel('chat')
        .listen('.message.sent', (e) => {
            // const exists = messages.value.some(
            //     msg => msg.content === e.message && msg.createdAt === e.created_at
            // );
            // if (!exists) {
            // }
            messages.value.push({
                content: e.message,
                type: 'received',
                senderName: e.senderName,
                createdAt: e.created_at
            });
            nextTick(scrollToBottom);
        });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.chat-area {
    height: 75vh;
    display: flex;
    flex-direction: column;
}

.chat-header {
    height: 64px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    flex-shrink: 0;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #fafafa;
    scroll-behavior: smooth;
}

.chat-input-bar {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-top: 1px solid #eee;
    background-color: #fff;
    flex-shrink: 0;
}

.message-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 100%;
}

.message-bubble {
    display: inline-block;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.4;
    max-width: 80%;
    word-wrap: break-word;
    white-space: pre-wrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sent {
    align-items: flex-end;
}

.sent .message-bubble {
    background-color: #DCF8C6;
    color: #000;
}

.received {
    align-items: flex-start;
}

.received .message-bubble {
    background-color: #f1f1f1;
    color: #000;
}

.sender-name {
    font-size: 12px;
    font-weight: 500;
    color: #666;
    margin-bottom: 4px;
}
</style>
