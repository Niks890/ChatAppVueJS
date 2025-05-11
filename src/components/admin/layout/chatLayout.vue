<template>
    <VContainer fluid class="fill-height pa-0">
        <VRow no-gutters class="fill-height">
            <!-- Danh sách bạn bè -->
            <v-slide-x-transition>
                <VCol v-if="!isMobile || showUserList" cols="12" md="3" class="pa-4 user-list"
                    style="border-right: 1px solid #ddd; background-color: #f9f9f9;">
                    <h3 class="mb-4">Danh sách người dùng</h3>
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
                        <VListItemSubtitle v-show="!isMobile" class="truncate-text" :title="item.lastMessage">
                            {{ (item.lastMessage || 'Chưa có tin nhắn').slice(0, 30) }}<span
                                v-if="(item.lastMessage || '').length > 30">...</span>
                        </VListItemSubtitle>
                    </VListItem>
                </VCol>
            </v-slide-x-transition>

            <VCol v-if="!selectedUserName" cols="12" md="9" class="d-flex align-center justify-center chat-area">
                <div class="welcome-message text-center">
                    <VAvatar color="primary" size="60" class="mb-4">
                        <VIcon icon="mdi-account-plus" size="40" />
                    </VAvatar>
                    <h2 class="welcome-text">Chào mừng đến với hệ thống chat!</h2>
                    <p class="empty-chat-text">Chọn người nhận để bắt đầu trò chuyện</p>
                </div>
            </VCol>

            <!-- Nội dung chat - Sử dụng v-if -->
            <VCol v-if="selectedUserName" cols="12" md="9" class="d-flex flex-column chat-area">
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
                            <p class="text-caption text-grey">{{ getStatus(selectedUserId) }}</p>
                        </div>
                    </div>
                    <VBtn icon variant="text" style="color: #7b7b7b;">
                        <VIcon icon="mdi-dots-vertical" />
                    </VBtn>
                </div>

                <div class="chat-messages" ref="chatBoxRef">
                    <!-- Nội dung chat -->
                    <div v-for="(msg, index) in messages" :key="index" class="message-wrapper" :class="msg.type">
                        <span v-if="msg.type === 'received'" class="sender-name">{{ msg.senderName }}</span>

                        <div class="message-bubble">
                            <!-- Chỉ hiển thị hình nếu messageType là 'file' hoặc 'text_file' -->
                            <div v-if="msg.messageType === 'file' || msg.messageType === 'text_file'">
                                <img :src="msg.file" alt="Hình ảnh" class="chat-image" />
                            </div>

                            <!-- Chỉ hiển thị text nếu messageType là 'text' hoặc 'text_file' -->
                            <div v-if="msg.messageType === 'text' || msg.messageType === 'text_file'">
                                {{ msg.content }}
                            </div>

                            <div class="message-time">
                                <span>{{ formatMessageDate(msg.createdAt) }}</span> -
                                <span>{{ formatTime(msg.createdAt) }}</span>
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
                    <VBtn icon class="rounded-full" color="grey" @click="triggerFileInput">
                        <VIcon icon="mdi-paperclip" />
                    </VBtn>
                    <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange" />
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
let statusInterval = null;

const selectedFiles = ref([]);
const fileInput = ref(null);

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            const fileUrl = response.data.url; // URL của file
            await sendMessage(fileUrl);  // Gửi tin nhắn kèm file
        } catch (error) {
            console.error('Error uploading or sending file:', error);
        }
    }
};

const getStatus = (userId) => {
    const user = users.value.find(u => u.id === userId);
    if (user) {
        if (user.status === 'offline') {
            return `Truy cập ${getOfflineDuration(user.last_seen)}`;
        }
        return 'Đang hoạt động';
    }
    return 'Không xác định';
};

const getOfflineDuration = (lastSeen) => {
    if (!lastSeen) {
        return 'không được xác định'; // Trường hợp last_seen là null
    }
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMillis = now - lastSeenDate; // Sự khác biệt tính theo milliseconds

    const seconds = Math.floor(diffInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} ngày trước`;
    }
    if (hours > 0) {
        return `${hours} giờ trước`;
    }
    if (minutes > 0) {
        return `${minutes} phút trước`;
    }
    return `${seconds} giây trước`;
};

const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
};

const formatMessageDate = (datetime) => {
    const messageDate = new Date(datetime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Kiểm tra nếu tin nhắn là hôm nay
    if (messageDate.toDateString() === today.toDateString()) {
        return "Hôm nay";
    }
    // Kiểm tra nếu tin nhắn là hôm qua
    if (messageDate.toDateString() === yesterday.toDateString()) {
        return "Hôm qua";
    }
    // Nếu không phải hôm nay hoặc hôm qua, trả về ngày trong định dạng dd/mm/yyyy
    return messageDate.toLocaleDateString("vi-VN");
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

// Quan trọng: Set up lại các event listener sau khi component được tạo lại
const setupEventListeners = () => {
    if (chatBoxRef.value) {
        chatBoxRef.value.addEventListener('scroll', handleScroll);
        // Kích hoạt handleScroll một lần ban đầu để thiết lập showScrollToBottom
        handleScroll();
    }
};

// Quan trọng: Xóa các event listener khi component unmount
const cleanupEventListeners = () => {
    if (chatBoxRef.value) {
        chatBoxRef.value.removeEventListener('scroll', handleScroll);
    }
};

// Watch khi có tin nhắn mới thì scroll xuống
watch(messages, async () => {
    await nextTick();
    scrollToBottom();
});

// Watch khi selectedUserName thay đổi
watch(selectedUserName, async (newVal, oldVal) => {
    // Xóa event listeners cũ nếu đang unmount component cũ
    if (oldVal && !newVal) {
        cleanupEventListeners();
    }

    // Thiết lập event listeners mới khi component mới được mount
    if (newVal) {
        await nextTick();
        setupEventListeners();
        scrollToBottom();
    }
});

const sendMessage = async (fileUrl = null) => {
    if (!message.value.trim() && !fileUrl) return;  // Không gửi nếu không có tin nhắn hay file
    try {
        const response = await api.post('/send-message', {
            message: message.value,
            group_id: selectedGroupId.value,
            user_id: userId.value,
            file: fileUrl || null // Gửi file nếu có
        });

        if (response.data.success) {
            messages.value.push({
                content: response.data.message.content,
                file: fileUrl,
                type: 'sent',
                senderName: response.data.message.senderName,
                createdAt: response.data.message.createdAt,
                messageType: response.data.message.messageType
            });
            updateLastMessage(selectedGroupId.value, response.data.message.content);
            message.value = '';  // Xóa nội dung message input sau khi gửi
            nextTick(scrollToBottom);  // Cuộn xuống cuối chat
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

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

        const lastMessage = res.data.data.length > 0 ? res.data.data[res.data.data.length - 1] : null;
        if (lastMessage) {
            const user = users.value.find(u => u.id === otherUserId);
            if (user) {
                user.lastMessage = lastMessage.message;  // Gán tin nhắn cuối cùng cho user
                updateLastMessage(groupId, lastMessage.message);  // Cập nhật ngay tin nhắn cuối cùng
            }
        }

        messages.value = res.data.data.map(msg => {
            let messageType = 'text';
            if (msg.file_path && msg.message) {
                messageType = 'text_file';
            } else if (msg.file_path) {
                messageType = 'file';
            }

            return {
                content: msg.message,
                type: msg.sender_id === userId.value ? 'sent' : 'received',
                senderName: msg.sender.name,
                file: msg.file_path,
                createdAt: msg.created_at,
                messageType: messageType,
            };
        });
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
        selectedUserId.value = otherUserId;
        await fetchMessages(res.data.data, otherUserId);

        selectedUserName.value = name;
        showUserList.value = isMobile.value ? false : true;

        // Đảm bảo giao diện được cập nhật trước khi thao tác với DOM
        await nextTick();
        // Thiết lập các event listener và scroll xuống dưới sau khi DOM được cập nhật
        setupEventListeners();
        scrollToBottom();
    } catch (error) {
        console.error('Lỗi khi chọn người dùng:', error);
    }
};

// Kiểm tra thiết bị mobile
const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
    if (!isMobile.value) showUserList.value = true;
};

const updateLastMessage = (groupId, message) => {
    // Update last message in the users array
    const user = users.value.find(u => u.group_id === groupId);
    if (user) {
        user.lastMessage = message;
    }
};

onMounted(() => {
    fetchUsers();
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Các event listener khác sẽ được thiết lập trong setupEventListeners
    // khi chat area được mount (thông qua watch selectedUserName)

    // Định kỳ 30s cập nhật trạng thái
    statusInterval = setInterval(() => {
        // Trigger lại reactive re-render bằng cách đổi mảng users shallow copy
        users.value = [...users.value];
    }, 30000); // 30s

    window.Echo.channel('chat')
        .listen('.message.sent', (e) => {
            // Nếu tin nhắn đến từ người khác mới push
            if (e.sender_id !== userId.value) {
                messages.value.push({
                    content: e.message,
                    type: 'received',
                    senderName: e.senderName,
                    createdAt: e.created_at,
                    messageType: e.messageType,
                    filePath: e.file_Path
                });

                updateLastMessage(e.group_id, e.message);
                nextTick(() => {
                    scrollToBottom();
                    // Kích hoạt lại handleScroll để cập nhật showScrollToBottom
                    handleScroll();
                });
            }
        });

    window.Echo.channel('user-status')
        .listen('.user.status', (e) => {
            const user = users.value.find(u => u.id === e.user_id);
            if (user) {
                user.status = e.status;
                if (e.status === 'offline') {
                    user.last_seen = e.last_seen; // Cập nhật thời gian last_seen
                } else if (e.status === 'online') {
                    user.last_seen = null;  // Không cần lưu last_seen nếu đang online
                }
            }
        });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
    cleanupEventListeners();
    if (statusInterval) clearInterval(statusInterval);
});
</script>

<style scoped>
.chat-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    margin-bottom: 5px;
}

.truncate-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    display: block;
}

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
    scroll-behavior: auto;
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

.empty-chat-message {
    text-align: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.welcome-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.welcome-text {
    font-size: 24px;
    color: #333;
    font-weight: bold;
}

.empty-chat-text {
    font-size: 16px;
    color: #777;
}
</style>
