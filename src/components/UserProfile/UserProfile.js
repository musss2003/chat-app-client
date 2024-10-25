import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user }) => {

    // Default dummy data with extended user information
    const displayedUser = {
        username: 'JohnDoe',
        email: 'johndoe@example.com',
        phone: '+1234567890',
        location: 'New York, USA',
        bio: 'Passionate software developer specializing in full-stack development.',
        joinedDate: 'January 2021',
        dateOfBirth: 'April 15, 1995',
        occupation: 'Full-Stack Developer',
        website: 'https://johndoe.dev',
        socialMedia: {
            twitter: '@johndoe',
            linkedin: 'linkedin.com/in/johndoe',
            github: 'github.com/johndoe'
        },
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        followers: 1250,
        following: 300,
    };


    return (
        <section className="user-profile">
            <header>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" 
                    alt={`${user.username}'s avatar`} 
                    className="avatar" 
                />
                <h2>{user.username}</h2>
            </header>

            <article className="info">
                <blockquote>
                    <p>{displayedUser.bio}</p>
                </blockquote>

                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {displayedUser.phone}</p>
                <p><strong>Location:</strong> {displayedUser.location}</p>
                <p><strong>Date of Birth:</strong> {displayedUser.dateOfBirth}</p>
                <p><strong>Occupation:</strong> {displayedUser.occupation}</p>
                <p><strong>Website:</strong> <a href={displayedUser.website} target="_blank" rel="noopener noreferrer">{displayedUser.website}</a></p>

                <section className="skills">
                    <h3>Skills</h3>
                    <ul>
                        {displayedUser.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                </section>

                <section className="social-media">
                    <h3>Social Media</h3>
                    <ul>
                        <li>Twitter: <a href={`https://twitter.com/${displayedUser.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer">{displayedUser.socialMedia.twitter}</a></li>
                        <li>LinkedIn: <a href={`https://${displayedUser.socialMedia.linkedin}`} target="_blank" rel="noopener noreferrer">{displayedUser.socialMedia.linkedin}</a></li>
                        <li>GitHub: <a href={`https://${displayedUser.socialMedia.github}`} target="_blank" rel="noopener noreferrer">{displayedUser.socialMedia.github}</a></li>
                    </ul>
                </section>

                <section className="followers">
                    <p><strong>Followers:</strong> {displayedUser.followers}</p>
                    <p><strong>Following:</strong> {displayedUser.following}</p>
                    <p><strong>Joined:</strong> {displayedUser.joinedDate}</p>
                </section>
            </article>
        </section>
    );
};

export default UserProfile;