import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import Message from '../models/Message.js';
import Channel from '../models/Channel.js';
import User from '../models/User.js';

/**
 * Registers the socket server and sets up event listeners.
 * 
 * @param {HttpServer} server - The HTTP server instance.
 * @returns {void}
 */
export const registerSocketServer = (server: HttpServer): void => {
  const io = new Server(server, {
    cors: {
      origin: 'https://twitch-tv-seven.vercel.app/',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-channel', async (channelId: string) => {
      socket.join(channelId);
      console.log(`Client ${socket.id} joined channel ${channelId}`);

      try {
        const channel = await Channel.findById(channelId).populate('messages').exec();
        if (channel) {
          const messages = channel.messages.slice(-100); 
          socket.emit('chat-history', { channelId, messages });
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    });

    socket.on('leave-channel', (channelId: string) => {
      socket.leave(channelId);
      console.log(`Client ${socket.id} left channel ${channelId}`);
    });

    socket.on('chat-message', async (data: { channelId: string, message: { author: string, content: string, date: string } }) => {
      console.log("Message received on server:", data.message.content);
      try {
        // Store the message in the database
        const newMessage = new Message({
          channelId: data.channelId,
          author: data.message.author,
          content: data.message.content,
          date: new Date(data.message.date)
        });
        await newMessage.save();

        // Add the message to the channel's messages array
        await Channel.findByIdAndUpdate(
          data.channelId,
          { $push: { messages: newMessage._id } },
          { new: true }
        );

        // Broadcast the message to all clients in the channel
        io.to(data.channelId).emit('new-message', newMessage);
      } catch (error) {
        console.error('Error saving message to database:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};