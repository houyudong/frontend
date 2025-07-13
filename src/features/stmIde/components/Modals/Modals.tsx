import React from 'react'
import NavigationModal from '../Modal/NavigationModal'
import { useNavigationModal } from '../../hooks/useNavigationModal'

const Modals: React.FC = () => {
  const { currentModal, isVisible } = useNavigationModal()

  return (
    <>
      {/* 导航模态框 */}
      {currentModal && (
        <NavigationModal
          isOpen={isVisible}
          title={currentModal.title}
          message={currentModal.message}
          type={currentModal.type}
          autoCloseDelay={currentModal.autoCloseDelay}
          onClose={currentModal.onClose}
        />
      )}

      {/* 变量添加对话框 */}
      <div className="modal" id="add-var-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>添加变量监视</h2>
            <button className="modal-close" id="btn-add-var-close">&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="var-name">变量名称</label>
              <input type="text" id="var-name" placeholder="输入变量名称" />
            </div>
          </div>
          <div className="modal-footer">
            <button id="btn-add-var-cancel">取消</button>
            <button id="btn-add-var-confirm" className="btn-primary">添加</button>
          </div>
        </div>
      </div>

      {/* 新建文件对话框 */}
      <div className="modal" id="new-file-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>新建文件</h2>
            <button className="modal-close" id="btn-new-file-close">&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="file-type">文件类型</label>
              <select id="file-type">
                <option value="c">C源文件 (.c)</option>
                <option value="h">C头文件 (.h)</option>
                <option value="cpp">C++源文件 (.cpp)</option>
                <option value="hpp">C++头文件 (.hpp)</option>
                <option value="txt">文本文件 (.txt)</option>
                <option value="md">Markdown文件 (.md)</option>
                <option value="json">JSON文件 (.json)</option>
                <option value="yaml">YAML文件 (.yaml)</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="file-name">文件名</label>
              <input type="text" id="file-name" placeholder="输入文件名（不含扩展名）" />
              <div className="form-text">扩展名将根据文件类型自动添加</div>
            </div>
            <div className="form-group">
              <label htmlFor="file-location">保存位置</label>
              <input type="text" id="file-location" placeholder="当前目录" readOnly />
            </div>
          </div>
          <div className="modal-footer">
            <button id="btn-new-file-cancel">取消</button>
            <button id="btn-new-file-confirm" className="btn-primary">创建</button>
          </div>
        </div>
      </div>

      {/* 新建文件夹对话框 */}
      <div className="modal" id="new-folder-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>新建文件夹</h2>
            <button className="modal-close" id="btn-new-folder-close">&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="folder-name">文件夹名</label>
              <input type="text" id="folder-name" placeholder="输入文件夹名" />
            </div>
            <div className="form-group">
              <label htmlFor="folder-location">保存位置</label>
              <input type="text" id="folder-location" placeholder="当前目录" readOnly />
            </div>
          </div>
          <div className="modal-footer">
            <button id="btn-new-folder-cancel">取消</button>
            <button id="btn-new-folder-confirm" className="btn-primary">创建</button>
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <div className="modal" id="delete-confirm-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>确认删除</h2>
            <button className="modal-close" id="btn-delete-confirm-close">&times;</button>
          </div>
          <div className="modal-body">
            <div className="delete-confirm-content">
              <div className="delete-icon">🗑️</div>
              <div className="delete-message">
                <p id="delete-message-text">确定要删除此项目吗？</p>
                <p className="delete-warning">此操作不可撤销</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button id="btn-delete-cancel">取消</button>
            <button id="btn-delete-confirm" className="btn-danger">删除</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modals
