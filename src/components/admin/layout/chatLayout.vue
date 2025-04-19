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
                            <!-- <p class="text-caption text-grey">Đang hoạt động</p> -->
                            <p class="text-caption text-grey">{{ getStatus(selectedUserId) }}</p>
                        </div>
                    </div>
                    <VBtn icon variant="text" style="color: #7b7b7b;">
                        <VIcon icon="mdi-dots-vertical" />
                    </VBtn>
                </div>

                <div class="chat-messages" ref="chatBoxRef">
                    <div v-if="!selectedUserName" class="empty-chat-message">
                        <p class="empty-chat-text">Chọn người nhận để bắt đầu trò chuyện</p>
                    </div>
                    <div v-for="(msg, index) in messages" :key="index" class="message-wrapper" :class="msg.type">
                        <span v-if="msg.type === 'received'" class="sender-name">{{ msg.senderName }}</span>
                        <div class="message-bubble">
                            {{ msg.content }}
                            <div class="message-time">
                                {{ formatTime(msg.createdAt) }}
                            </div>
                        </div>
                    </div>
                </div>

                <VBtn v-show="showScrollToBottom" class="scroll-to-bottom" icon color="primary" @click="scrollToBottom">
                    <VIcon icon="mdi-arrow-down" />
                </VBtn>

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
const showScrollToBottom = ref(false);
const selectedUserId = ref(null);

const getStatus = (userId) => {
    const user = users.value.find(u => u.id === userId);
    return user ? (user.status === 'offline' ? 'Không hoạt động' : 'Đang hoạt động') : 'Không xác định';
};

const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
};

// Scroll xuống cuối khung chat
const scrollToBottom = () => {
    const el = chatBoxRef.value;
    if (el) el.scrollTop = el.scrollHeight;
};

const handleScroll = () => {
    const el = chatBoxRef.value;
    if (!el) return;
    // Nếu cách bottom > 100px thì hiện nút
    showScrollToBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight > 100;
};

// Watch khi có tin nhắn mới thì scroll xuống
watch(messages, async () => {
    await nextTick();
    scrollToBottom();
});



const sendMessage = async () => {
    if (!message.value.trim()) return;

    const response = await api.post('/send-message', {
        message: message.value,
        group_id: selectedGroupId.value,
        user_id: userId.value
    });

    // console.log(response.data);

    if (response.data.success) {
        // Thêm tin nhắn vào messages từ response của API
        messages.value.push({
            content: response.data.message.content,
            type: 'sent',
            senderName: response.data.message.senderName,
            createdAt: response.data.message.createdAt
        });
        message.value = '';  // Xóa nội dung message input sau khi gửi
        nextTick(scrollToBottom);  // Cuộn xuống cuối chat
    }
};



// Fetch danh sách user
// const fetchUsers = async () => {
//     try {
//         const res = await api.get('/users');
//         // console.log(res.data);
//         users.value = res.data.data.filter(user => user.id !== userId.value);
//     } catch (error) {
//         console.error('Lỗi khi lấy danh sách user:', error);
//     }
// };

// Fetch danh sách user
const fetchUsers = async () => {
    try {
        const res = await api.get('/users');
        // Lưu thông tin người dùng và thêm trạng thái vào mỗi user
        users.value = res.data.data.filter(user => user.id !== userId.value).map(user => ({
            ...user,
            status: user.status // Đảm bảo có trường trạng thái cho mỗi người dùng
        }));
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
        // console.log(res.data);

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
        // console.log('Group ID:', res.data.data);
        selectedUserId.value = otherUserId;
        // console.log('Selected User ID:', otherUserId);
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
    chatBoxRef.value?.addEventListener('scroll', handleScroll);
    window.Echo.channel('chat')
        .listen('.message.sent', (e) => {
            // Nếu tin nhắn đến từ người khác mới push
            if (e.sender_id !== userId.value) {
                messages.value.push({
                    content: e.message,
                    type: 'received',
                    senderName: e.senderName,
                    createdAt: e.created_at
                });
                nextTick(scrollToBottom);
            }
        });

});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
    chatBoxRef.value?.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.empty-chat-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #aaa;
    font-size: 16px;
    font-weight: 500;
}

.empty-chat-text {
    text-align: center;
    margin: 0;
}

.message-time {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
    text-align: right;
}

.chat-area {
    height: 75vh;
    display: flex;
    flex-direction: column;
    position: relative;
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

.scroll-to-bottom {
    position: absolute;
    bottom: 80px;
    right: 24px;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
